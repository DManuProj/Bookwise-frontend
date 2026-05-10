import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Type for what /api/me returns (matches your backend)
type MeData = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  photoUrl: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE" | "REMOVED";
  profileComplete: boolean;
  onboardingComplete: boolean;
  orgId: string | null;
  org: {
    id: string;
    name: string;
    slug: string;
    // ... whatever fields your backend includes
  } | null;
};

type UpdateMeInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
};

export function useMe() {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<MeData>({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const res = await api.get(endpoints.me);
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
  });
}

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
