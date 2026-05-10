import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { Service, ServiceFormInputs } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//GET SERVICES
export const useServices = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<Service[]>({
    queryKey: queryKeys.services,
    queryFn: async () => {
      const res = await api.get(endpoints.services);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
};

//CREATE SERVICE
export const useCreateService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceFormInputs) => {
      const r = await api.post(endpoints.services, data);
      return r.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
      showSuccessToast("Service has been created");
    },
    onError: (error) => showErrorToast(error),
  });
};

//UPDATE SERVICE
export const useUpdateService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ServiceFormInputs>;
    }) => {
      const r = await api.put(endpoints.serviceById(id), data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
      showSuccessToast("Service updated");
    },
    onError: (error) => showErrorToast(error),
  });
};

// DELETE SERVICE
export const useDeleteService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const r = await api.delete(endpoints.serviceById(id));
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
      showSuccessToast("Service deleted");
    },
    onError: (error) => showErrorToast(error),
  });
};
