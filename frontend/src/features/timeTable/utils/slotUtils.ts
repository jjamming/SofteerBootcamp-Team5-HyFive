import type { AvailableTimeSlotType } from "@/features/timeTable/TimeTable.type";

/**
 * 슬롯 관련 유틸리티 함수들
 */
export const slotUtils = {
  /**
   * 두 개의 시간 슬롯이 동일한지 확인합니다.
   * @param a 첫 번째 시간 슬롯
   * @param b 두 번째 시간 슬롯
   * @returns 동일하면 true, 아니면 false
   */
  isSameSlot: (a: AvailableTimeSlotType, b: AvailableTimeSlotType): boolean => {
    return (
      a.rentalDate === b.rentalDate &&
      a.rentalStartTime === b.rentalStartTime &&
      a.rentalEndTime === b.rentalEndTime
    );
  },
};
