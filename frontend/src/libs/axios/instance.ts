import axios from "axios";
import environment from "@/config/environment";
import { getSession } from "next-auth/react";
import { DefaultSession } from "next-auth";

interface Session extends DefaultSession {
  accessToken?: string;
}

const instance = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

instance.interceptors.request.use(
  async (request) => {
    const session: Session | null = await getSession();
    if (session) {
      request.headers.Authorization = `Bearer ${session.accessToken as string}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
