import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import environment from "@/config/environment";
import { getSession, signOut } from "next-auth/react";
import { SessionExtended } from "@/types/Auth";
import authService from "@/services/auth";
import {
  getAccessTokenOverride,
  setAccessTokenOverride,
  clearAccessTokenOverride,
} from "@/services/tokenStore";
import { isTokenExpired } from "@/utils/jwt";

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
      const override = getAccessTokenOverride();

      // Use override token ONLY if it's not expired
      if (override) {
        if (isTokenExpired(override)) {
          console.log(
            "🧹 Override token expired - clearing and using session token",
          );
          clearAccessTokenOverride();
        } else {
          request.headers.Authorization = `Bearer ${override}`;
          return request;
        }
      }

      const session: SessionExtended | null = await getSession();

      if (session?.accessToken) {
        request.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    return request;
  },
  (error) => {
    console.error("❌ REQUEST INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config as CustomAxiosRequestConfig | undefined;
    const status = error?.response?.status;

    if (!original) return Promise.reject(error);

    const url = (original.url || "").toString();
    if (url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Reactive token refresh on 401 error
    original._retry = true;

    console.log(
      `🔄 401 Error detected on ${url} - attempting token refresh...`,
    );

    try {
      if (isRefreshing) {
        console.log("⏳ Refresh already in progress, queuing request...");
        const newToken = await new Promise<string | null>((resolve) =>
          refreshQueue.push(resolve),
        );
        if (newToken) {
          console.log("✅ Queued request retrying with new token");
          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          return instance(original);
        }
        throw error;
      }

      isRefreshing = true;

      const session: SessionExtended | null = await getSession();
      const refreshToken = session?.refreshToken;

      if (!refreshToken) throw new Error("Missing refresh token");

      console.log("🔑 Refreshing access token...");
      const startTime = Date.now();
      const res = await authService.refreshToken(refreshToken);
      const duration = Date.now() - startTime;
      const newAccessToken = res?.data?.accessToken;

      if (!newAccessToken) throw new Error("Failed to refresh token");

      // Save to sessionStorage so it persists for all future requests
      setAccessTokenOverride(newAccessToken);
      console.log(`✅ Token refreshed successfully in ${duration}ms`);

      original.headers = original.headers || {};
      (original.headers as any).Authorization = `Bearer ${newAccessToken}`;

      refreshQueue.forEach((resolve) => resolve(newAccessToken));
      refreshQueue = [];
      isRefreshing = false;

      console.log(`🔁 Retrying original request to ${url}`);
      return instance(original);
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
      refreshQueue.forEach((resolve) => resolve(null));
      refreshQueue = [];
      isRefreshing = false;

      setAccessTokenOverride(null);
      console.log("🚪 Signing out user due to refresh failure");
      await signOut({ redirect: true });
      return Promise.reject(err);
    }
  },
);

export default instance;
