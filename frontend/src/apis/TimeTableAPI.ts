import type { AvailableTimeSlotType } from "@/features/timeTable/TimeTable.type";
import { clientInstance } from "@/utils/AxiosInstance";
import type { CustomError } from "@/utils/CustomError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export interface TimeSlotAPIResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    id: number;
    carId: number;
    rentalDate: string;
    rentalStartTime: string;
    rentalEndTime: string;
  }[];
}

export const timeSlotQueryKey = (carId: number, weekKey: string) =>
  ["timeSlot", carId, weekKey] as const;

export const useGetTimeSlot = (
  selectedCarId: number,
  weekKey: string,
  options?: {
    onSuccess?: (data: TimeSlotAPIResponse) => void;
  },
) => {
  const { data, isFetching, isSuccess, error, refetch } =
    useQuery<TimeSlotAPIResponse>({
      queryKey: timeSlotQueryKey(selectedCarId, weekKey),
      queryFn: () =>
        clientInstance.get(`/rental?car-id=${selectedCarId}&date=${weekKey}`),
      enabled: selectedCarId > 0,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });

  useEffect(() => {
    if (isSuccess && data) {
      options?.onSuccess?.(data);
    }
  }, [isSuccess, data, options?.onSuccess]);

  const timeSlotData = data?.data ?? [];

  return {
    timeSlotData,
    isFetching,
    error,
    refetch,
  };
};

export const usePostTimeSlot = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    TimeSlotAPIResponse,
    CustomError,
    {
      selectedCarId: number;
      weekKey: string;
      timeSlots: AvailableTimeSlotType[];
    }
  >({
    mutationFn: ({ selectedCarId, weekKey, timeSlots }) =>
      clientInstance.post(
        `/rental?car-id=${selectedCarId}&date=${weekKey}`,
        timeSlots,
      ),
    onSuccess: (data, variables) => {
      const { selectedCarId, weekKey } = variables;
      queryClient.setQueryData(timeSlotQueryKey(selectedCarId, weekKey), data);
    },
  });

  return {
    createTimeSlot: mutation.mutate,
    error: mutation.error,
  };
};
