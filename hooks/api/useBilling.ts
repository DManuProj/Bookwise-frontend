"use client";

import { useApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import type {
  BillingStatus,
  SubscribePayload,
  SubscribeResponse,
  PortalResponse,
  TierUsage,
} from "@/types";

//  current plan info
export const useBillingStatus = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<BillingStatus>({
    queryKey: queryKeys.billing,
    queryFn: async () => {
      const res = await api.get(endpoints.billingStatus);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
};

// Current resource usage vs caps
export const useTierUsage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<TierUsage>({
    queryKey: queryKeys.tierUsage,
    queryFn: async () => {
      const res = await api.get(endpoints.billingUsage);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
};

// Returns clientSecret for new subs; { message } for plan switches
export const useSubscribe = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation<SubscribeResponse, unknown, SubscribePayload>({
    mutationFn: async (payload) => {
      const res = await api.post(endpoints.billingSubscribe, payload);
      return res.data;
    },

    onSuccess: (data) => {
      // Plan switch path: backend returns { message, subscriptionId }
      // New sub path: caller handles clientSecret + Stripe confirm flow
      // Either way: refresh billing status so UI reflects new plan
      queryClient.invalidateQueries({ queryKey: queryKeys.billing });

      if (data.message) {
        showSuccessToast(data.message);
      }
      // No toast for new-sub path — payment modal owns the success state
    },

    onError: (error) => showErrorToast(error),
  });
};

export const useCreatePortalSession = () => {
  const api = useApi();

  return useMutation<PortalResponse, unknown>({
    mutationFn: async () => {
      const res = await api.post(endpoints.billingPortal);
      return res.data;
    },

    onError: (error) => showErrorToast(error),
    // No onSuccess toast — caller redirects to URL immediately
  });
};
