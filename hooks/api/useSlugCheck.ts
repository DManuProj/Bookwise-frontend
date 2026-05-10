"use client";

import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

export function useSlugCheck(slug: string) {
  const api = useApi();
  const debouncedSlug = useDebounce(slug, 300);

  // Validation checks — must match what the backend accepts
  const isLongEnough = debouncedSlug.length >= 3;
  const isValidFormat = /^[a-z0-9-]+$/.test(debouncedSlug);
  const isValid = isLongEnough && isValidFormat;

  return useQuery<{ available: boolean }>({
    queryKey: queryKeys.slugCheck(debouncedSlug),
    queryFn: async () => {
      const res = await api.get(endpoints.slugCheck(debouncedSlug));
      return res.data;
    },
    enabled: isValid, // ← only fire when valid
  });
}
