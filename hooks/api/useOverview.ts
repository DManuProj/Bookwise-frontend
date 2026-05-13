import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import { DashboardOverview } from "@/types/overview";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useOverview = () => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<DashboardOverview>({
    queryKey: queryKeys.overview,
    queryFn: async () => {
      const res = await api.get(endpoints.overview);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
};
