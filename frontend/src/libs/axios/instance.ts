import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import environment from "@/config/environment";
import { getSession } from "next-auth/react";
import { DefaultSession } from "next-auth";

interface Session extends DefaultSession {
  accessToken?: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

const instance = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

instance.interceptors.request.use(
  async (request: CustomAxiosRequestConfig) => {
    // selalu pastikan headers ada
    request.headers = (request.headers || {}) as AxiosRequestHeaders;

    if (!request.skipAuth) {
      const session: Session | null = await getSession();
      if (session?.accessToken) {
        request.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    return request;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default instance;
