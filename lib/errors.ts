import { AxiosError } from "axios";

type LaravelErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as LaravelErrorPayload | undefined;
    const validationMessages = payload?.errors ? Object.values(payload.errors).flat() : [];

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }

    if (payload?.message) {
      return payload.message;
    }
  }

  return fallback;
}
