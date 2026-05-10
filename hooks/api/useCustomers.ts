import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import {
  CustomerDetail,
  CustomersFilters,
  CustomersListResponse,
} from "@/types";
import { useUser } from "@clerk/nextjs";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCustomers = (filters: CustomersFilters) => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<CustomersListResponse>({
    queryKey: queryKeys.customers(filters),
    queryFn: async () => {
      const res = await api.get(endpoints.customers, { params: filters });
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
    placeholderData: keepPreviousData,
  });
};

export const useCustomer = (id: string | null) => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<CustomerDetail>({
    queryKey: queryKeys.customer(id ?? ""),
    queryFn: async () => {
      const res = await api.get(endpoints.customerById(id!));
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn && !!id,
  });
};

export const useUpdateCustomerNotes = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const res = await api.put(endpoints.customerNotes(id), { notes });
      return res.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(vars.id) });
      showSuccessToast("Notes updated");
    },
    onError: (error) => showErrorToast(error),
  });
};
