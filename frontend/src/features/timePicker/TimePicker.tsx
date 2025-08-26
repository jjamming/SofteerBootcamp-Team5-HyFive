import { css } from "@emotion/react";
import { theme } from "@/styles/themes.style";
import { useState } from "react";
import type { Meridiem } from "@/features/timePicker/TimePicker.type";
import AMPMSelector from "@/features/timePicker/AMPMSelector";
import { formatTime24Hour, validateTimePicker } from "@/utils/UserValidation";

const { color, typography, borderRadius } = theme;

interface TimePickerProps {
  onCancel: () => void;
  onConfirm: (time: string) => void;
}

const TimePicker = ({ onCancel, onConfirm }: TimePickerProps) => {
  const [selectedMeridiem, setSelectedMeridiem] = useState<Meridiem>("AM");
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 시간 입력 핸들러
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/^0+/, "");
    // 0-12 범위만 허용
    if (parseInt(formattedValue) > 12) {
      setErrorMessage("시간은 0-12 사이로 입력해주세요");
      return;
    }
    if (
      formattedValue === "" ||
      (parseInt(formattedValue) >= 0 && parseInt(formattedValue) <= 12)
    ) {
      setHour(formattedValue);
      setErrorMessage("");
    }
  };

  // 분 입력 핸들러
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value.replace(/^0+/, "");
    if (parseInt(formattedValue) > 59) {
      setErrorMessage("분은 0-59 사이로 입력해주세요");
      return;
    }
    if (
      value === "" ||
      (parseInt(formattedValue) >= 0 && parseInt(formattedValue) <= 59)
    ) {
      setMinute(formattedValue);
      setErrorMessage("");
    }
  };

  const handleConfirm = () => {
    const validationError = validateTimePicker(hour, minute);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    // 24시간 형식으로 변환하여 전달
    const time24Hour = formatTime24Hour(hour, minute, selectedMeridiem);
    onConfirm(time24Hour);
  };

  return (
    <div css={TimePickerContainer}>
      <h3 css={TitleStyle}>시간을 입력해주세요.</h3>
      <div css={InputSection}>
        <input
          css={InputBoxStyle}
          placeholder="00"
          maxLength={2}
          type="number"
          value={hour}
          onChange={handleHourChange}
          min="0"
          max="12"
        />
        <span
          css={{
            font: typography.Heading.h1_semi,
            color: color.GrayScale.black,
          }}
        >
          :
        </span>
        <input
          css={InputBoxStyle}
          placeholder="00"
          maxLength={2}
          type="number"
          value={minute}
          onChange={handleMinuteChange}
          min="0"
          max="59"
        />
        <AMPMSelector
          selectedMeridiem={selectedMeridiem}
          onClick={setSelectedMeridiem}
        />
      </div>
      {errorMessage && <div css={ErrorMessageStyle}>{errorMessage}</div>}
      <div css={ButtonSection}>
        <button css={ButtonStyle("cancel")} onClick={onCancel}>
          취소
        </button>
        <button css={ButtonStyle("confirm")} onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
};

export default TimePicker;

const TimePickerContainer = css`
  display: flex;
  width: 461px;
  flex-direction: column;
  padding-top: 40px;
  border: 1px solid ${color.GrayScale.gray3};
  border-radius: ${borderRadius.Large};
  background-color: ${color.GrayScale.white};
`;

const TitleStyle = css`
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 36px;
  font: ${typography.Body.b1_medi};
  color: ${color.GrayScale.gray6};
`;

const InputSection = css`
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  gap: 19px;
  align-items: center;
  justify-content: center;
`;

const InputBoxStyle = css`
  display: flex;
  width: 50px;
  padding: 24px 36px;
  align-items: center;
  justify-content: center;
  font: ${typography.Heading.h1_semi};
  color: ${color.GrayScale.black};
  border-radius: ${borderRadius.Large};
  border: 2px solid ${color.GrayScale.gray1};
  background-color: ${color.GrayScale.gray1};
  text-align: right;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: ${color.GrayScale.black};
  }
  &:focus::placeholder {
    color: transparent;
  }
  &:focus {
    outline: none;
    background-color: ${color.GrayScale.white};
    border: 2px solid ${color.Maincolor.primary};
    caret-color: ${color.Maincolor.primary};
  }
`;

const ButtonSection = css`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: end;
`;

const ButtonStyle = (type: "cancel" | "confirm") => css`
  padding: 24px 32px;
  background-color: transparent;
  cursor: pointer;
  font: ${typography.Label.l2_semi};
  color: ${type === "cancel" ? color.GrayScale.gray4 : color.Semantic.success};
`;

const ErrorMessageStyle = css`
  padding: 20px 40px 0 40px;
  font: ${typography.Body.b4_regu};
  color: ${color.Semantic.error};
  text-align: left;
`;
