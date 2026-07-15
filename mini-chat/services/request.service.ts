import type { ApiResponse } from "@/types/chat.type";
import type { AxiosResponse } from "axios";

export function unwrapResponse<T>(
  response: AxiosResponse<ApiResponse<T> | T>,
): T {
  const body = response.data;

  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    "statusCode" in body
  ) {
    return (body as ApiResponse<T>).data;
  }

  return body as T;
}
