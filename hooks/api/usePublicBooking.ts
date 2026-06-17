import api from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { PublicOrgResponse } from "@/types";
import { PublicCreateBookingPayload, PublicBookingResponse } from "@/types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const usePublicOrg = (slug: string) => {
  return useQuery<PublicOrgResponse>({
    queryKey: queryKeys.publicOrg(slug),
    queryFn: async () => {
      const res = await api.get(endpoints.publicOrg(slug));
      return res.data;
    },
    enabled: !!slug,
    retry: false,
  });
};

// READ — available time slots for a given service/staff/date
export const usePublicSlots = (
  slug: string,
  serviceId: string,
  staffId: string | null, // null = "no preference" (any-staff)
  date: string, // YYYY-MM-DD
) => {
  return useQuery<string[]>({
    queryKey: queryKeys.publicSlots(slug, serviceId, staffId, date),
    queryFn: async () => {
      const params: Record<string, string> = { serviceId, date };
      if (staffId) params.staffId = staffId;
      const res = await api.get(endpoints.publicSlots(slug), { params });
      return res.data;
    },
    enabled: !!slug && !!serviceId && !!date,
    placeholderData: keepPreviousData,
  });
};

// CREATE — submit the public booking
// No success toast on purpose — the confirmation screen IS the success signal.
export const useCreatePublicBooking = () => {
  return useMutation<
    PublicBookingResponse,
    unknown,
    PublicCreateBookingPayload
  >({
    mutationFn: async (data) => {
      const res = await api.post(endpoints.publicBookings, data);
      return res.data;
    },
    onError: (error) => showErrorToast(error),
  });
};
