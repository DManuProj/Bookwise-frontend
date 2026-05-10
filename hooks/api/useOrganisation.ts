import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { Organisation, OrganisationResponse, WorkingHour } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrganisation = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<OrganisationResponse>({
    queryKey: queryKeys.organisation,
    queryFn: async () => {
      const res = await api.get(endpoints.organisation);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
};

export const useUpdateOrganisation = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organisation>) => {
      const r = await api.put(endpoints.organisation, data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organisation });
      showSuccessToast("Settings saved");
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useUpdateWorkingHours = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workingHours: WorkingHour[]) =>
      api
        .put(endpoints.organisationHours, { workingHours })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organisation });
      showSuccessToast("Working hours updated");
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useDeleteOrganisation = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const r = await api.delete(endpoints.organisation);
      return r.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => showErrorToast(error),
  });
};
