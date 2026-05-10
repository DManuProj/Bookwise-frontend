import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { Role, SendInvitation, StaffResponse } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStaff = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<StaffResponse>({
    queryKey: queryKeys.staff,
    queryFn: async () => {
      const res = await api.get(endpoints.staff);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
};

export const useStaffInvite = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendInvitation) => {
      const r = await api.post(endpoints.staffInvite, data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff });
      showSuccessToast("Invitation has been created");
    },
    onError: (error) => showErrorToast(error),
  });
};

// CHANGE THE USER ROLE (ADMIN/MEMBER)
export const useStaffChangeRole = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      const r = await api.put(endpoints.staffChangeRole(id), { role });
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff });
      showSuccessToast("Role has been updated");
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useDeleteStaff = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const r = await api.delete(endpoints.staffRemove(id));
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff });
      showSuccessToast("Staff member deleted");
    },
    onError: (error) => showErrorToast(error),
  });
};

// RESEND INVITATION (lives on /api/invitations/:id/resend on backend)
export const useResendInvitation = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const r = await api.post(endpoints.resendInvitation(id));
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff });
      showSuccessToast("Invitation resent");
    },
    onError: (error) => showErrorToast(error),
  });
};

// CANCEL INVITATION
export const useCancelInvitation = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const r = await api.patch(endpoints.cancelInvitation(id));
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff });
      showSuccessToast("Invitation cancelled");
    },
    onError: (error) => showErrorToast(error),
  });
};
