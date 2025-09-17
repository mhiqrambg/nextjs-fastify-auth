// src/utils/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.WAHA_API_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-Api-Key": process.env.WAHA_X_API_KEY,
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[WAHA ERROR]", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("[WAHA ERROR] No response:", error.request);
    } else {
      console.error("[WAHA ERROR] Config:", error.message);
    }
    return Promise.reject(error);
  }
);
