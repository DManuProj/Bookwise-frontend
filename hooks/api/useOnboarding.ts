import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { OnboardingData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useOnboarding = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OnboardingData) => {
      const { logo, ...rest } = data;
      const payload = {
        ...rest,
        // Strip frontend-only fields from each staff member
        staff: data.staff.map(({ id, isOwner, ...staffMember }) => staffMember),
        // workingHours and services already match backend shape
      };
      const r = await api.post(endpoints.onboarding, payload);
      return r.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      showSuccessToast("Welcome to Bookwise");
    },
    onError: (error) => showErrorToast(error),
  });
};
