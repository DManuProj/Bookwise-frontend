import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateMeInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
};

export const useUpdateMe = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMeInput) => {
      const r = await api.put(endpoints.me, data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      showSuccessToast("User updated");
    },
    onError: (error) => showErrorToast(error),
  });
};
