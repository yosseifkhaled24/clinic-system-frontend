import { AxiosError } from "axios";

type LaravelErrorPayload = {
  message?: string;
  code?: string;
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

/** HTTP status of a failed request, when the server answered at all. */
export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }

  return undefined;
}

/** Machine-readable `code` field of a Laravel error payload, if any. */
export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof AxiosError) {
    return (error.response?.data as LaravelErrorPayload | undefined)?.code;
  }

  return undefined;
}
