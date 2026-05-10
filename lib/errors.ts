// lib/errors.ts

import { toast } from "sonner";
import { AxiosError } from "axios";

/**
 * Extract a user-friendly error message from any error.
 * Handles axios errors, regular errors, and unknown values.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

/**
 * Show a red error toast with the message extracted from the error.
 * Use in onError callbacks of mutations.
 */
export function showErrorToast(
  error: unknown,
  fallback = "Something went wrong",
) {
  const message = getErrorMessage(error) || fallback;
  toast.error(message);
}

/**
 * Show a green success toast.
 * Use in onSuccess callbacks of mutations.
 */
export function showSuccessToast(message: string) {
  toast.success(message);
}
