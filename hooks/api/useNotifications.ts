import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { Notification } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<Notification[]>({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      const res = await api.get(endpoints.notifications);
      return res.data;
    },

    enabled: isLoaded && !!isSignedIn,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
};

export const useMarkAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(endpoints.markNotificationRead(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useMarkAllAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.put(endpoints.markAllNotificationsRead);
      return res.data;
    },
    onSuccess: () => {
      showSuccessToast("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => showErrorToast(error),
  });
};
