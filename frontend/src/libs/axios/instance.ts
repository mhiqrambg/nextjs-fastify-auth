import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import environment from "@/config/environment";
import { getSession, signOut } from "next-auth/react";
import { SessionExtended } from "@/types/Auth";
import authService from "@/services/auth"; // default import, konsisten
import {
  getAccessTokenOverride,
  setAccessTokenOverride,
} from "@/services/tokenStore";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

const instance = axios.create({
  baseURL: environment.API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

instance.interceptors.request.use(
  async (request: CustomAxiosRequestConfig) => {
    request.headers = (request.headers || {}) as AxiosRequestHeaders;

    if (!request.skipAuth) {
      // 1) Pakai token override jika ada (hasil refresh terbaru)
      const override = getAccessTokenOverride();
      if (override) {
        request.headers.Authorization = `Bearer ${override}`;
        return request;
      }

      // 2) Fallback ke NextAuth session
      const session: SessionExtended | null = await getSession();
      if (session?.accessToken) {
        request.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    return request;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config as CustomAxiosRequestConfig | undefined;
    const status = error?.response?.status;

    if (!original) return Promise.reject(error);

    // Guard: jangan refresh untuk endpoint refresh agar tak loop
    const url = (original.url || "").toString();
    if (url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Jika bukan 401 atau sudah _retry → lempar error
    if (status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      // Jika sedang refresh, antre sampai selesai
      if (isRefreshing) {
        const newToken = await new Promise<string | null>((resolve) =>
          refreshQueue.push(resolve),
        );
        if (newToken) {
          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          return instance(original);
        }
        throw error;
      }

      isRefreshing = true;

      // Ambil refreshToken dari Session
      const session: SessionExtended | null = await getSession();
      const refreshToken = session?.refreshToken;
      if (!refreshToken) throw new Error("Missing refresh token");

      // Panggil refresh (tanpa Bearer)
      const res = await authService.refreshToken(refreshToken);
      console.log("res", res);

      // Amankan parsing sesuai backend kamu
      const newAccessToken = res?.data?.accessToken;

      if (!newAccessToken) throw new Error("Failed to refresh token");

      // Simpan override agar request berikutnya otomatis pakai token baru
      setAccessTokenOverride(newAccessToken);

      // Update header request yang gagal & retry
      original.headers = original.headers || {};
      (original.headers as any).Authorization = `Bearer ${newAccessToken}`;

      // Bangunkan antrean
      refreshQueue.forEach((resolve) => resolve(newAccessToken));
      refreshQueue = [];
      isRefreshing = false;

      return instance(original);
    } catch (err) {
      // Gagalkan antrean dan keluar
      refreshQueue.forEach((resolve) => resolve(null));
      refreshQueue = [];
      isRefreshing = false;

      // Bersihkan override & paksa signOut
      setAccessTokenOverride(null);
      await signOut({ redirect: true });
      return Promise.reject(err);
    }
  },
);

export default instance;
