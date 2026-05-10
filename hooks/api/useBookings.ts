import { useApi } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { showErrorToast, showSuccessToast } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import {
  BookingsFilters,
  BookingsListResponse,
  CreateBookingPayload,
  EditBookingPayload,
  UpdateBookingStatusPayload,
} from "@/types";
import { useUser } from "@clerk/nextjs";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useBookings = (filters: BookingsFilters) => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<BookingsListResponse>({
    queryKey: queryKeys.bookings(filters),
    queryFn: async () => {
      const res = await api.get(endpoints.bookings, { params: filters });
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn,
    placeholderData: keepPreviousData,
  });
};

export const useCreateBooking = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingPayload) => {
      const res = await api.post(endpoints.bookings, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSuccessToast("Booking has been created");
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useUpdateBooking = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBookingStatusPayload) => {
      const res = await api.put(endpoints.updateBookingById(data.id), {
        status: data.status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSuccessToast("Booking status has been updated");
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useEditBooking = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EditBookingPayload) => {
      const res = await api.patch(endpoints.updateBookingById(id), data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showSuccessToast("Booking has been updated");
    },
    onError: (error) => showErrorToast(error),
  });
};

export const useBookingSlots = (
  serviceId: string,
  staffId: string,
  date: string,
  excludeBookingId?: string,
) => {
  const { isSignedIn, isLoaded } = useUser();
  const api = useApi();

  return useQuery<string[]>({
    queryKey: queryKeys.bookingSlots(serviceId, staffId, date, excludeBookingId),
    queryFn: async () => {
      const params: any = { serviceId, staffId, date };
      if (excludeBookingId) params.excludeBookingId = excludeBookingId;
      const res = await api.get(endpoints.bookingSlots, { params });
      return res.data;
    },
    enabled: isLoaded && !!isSignedIn && !!serviceId && !!staffId && !!date,
    placeholderData: keepPreviousData,
  });
};
