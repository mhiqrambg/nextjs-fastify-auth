import axios, { AxiosError } from "axios";

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    return (
      axiosError.response?.data?.details?.[0]?.message ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unexpected server error"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
