"use client";

import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { Invitation } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useInvitation = (token: string) => {
  return useQuery<Invitation>({
    queryKey: queryKeys.invitation(token),
    queryFn: async () => {
      const res = await api.get(endpoints.invitation(token));
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: async ({
      token,
      clerkId,
    }: {
      token: string;
      clerkId: string;
    }) => {
      const res = await api.post(endpoints.acceptInvitation(token), {
        clerkId,
      });
      return res.data;
    },
    onSuccess: () => {
      showSuccessToast("Accepted the invitation successfully. ");
    },
    // onError: (error) => showErrorToast(error),
  });
};
