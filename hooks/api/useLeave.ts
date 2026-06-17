import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import {
  Leave,
  LeaveFilters,
  LeaveRequestPayload,
  LeaveStatusUpdatePayload,
} from "@/types/leave";
import { useUser } from "@clerk/nextjs";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// READ — list leave requests
// Backend silently scopes: non-admins see only their own
export const useLeave = (filters: LeaveFilters) => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<Leave[]>({
    queryKey: queryKeys.leave(filters),
    queryFn: async () => {
      const res = await api.get(endpoints.leave, { params: filters });
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
    placeholderData: keepPreviousData,
  });
};

// CREATE — submit a leave request
export const useRequestLeave = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LeaveRequestPayload) => {
      const res = await api.post(endpoints.leave, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave"] });
      showSuccessToast("Leave request submitted");
    },
    onError: (error) => showErrorToast(error),
  });
};

// UPDATE — approve / reject (admin only on backend)
export const useUpdateLeaveStatus = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: LeaveStatusUpdatePayload) => {
      const res = await api.put(endpoints.leaveById(id), { status });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leave"] });
      showSuccessToast(
        variables.status === "APPROVED"
          ? "Leave request approved"
          : "Leave request rejected",
      );
    },
    onError: (error) => showErrorToast(error),
  });
};

// DELETE — cancel (self or admin)
export const useCancelLeave = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(endpoints.leaveById(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave"] });
      showSuccessToast("Leave request cancelled");
    },
    onError: (error) => showErrorToast(error),
  });
};
