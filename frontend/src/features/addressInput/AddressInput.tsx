import { useEffect, useState } from "react";
import { theme } from "@/styles/themes.style";
import { SearchIcon, ThreeDotsIcon } from "@/assets/icons";
import Input from "@/components/Input";
import AddressDropdown, { type AddressItem } from "./AddressDropdown";
import { AddrInputContainer, InputSection } from "./AddressInput.style";
import { useDebounce } from "@/hooks/useDebounce";
import { useAddressSearch } from "./useAddressSearch";

const { color } = theme;

interface AddressInputProps {
  onFocus?: () => void;
  onDepartureChange?: (address: string) => void;
  onDestinationChange?: (address: string) => void;
  departureValue?: string;
  destinationValue?: string;
}

type Field = "departure" | "destination";
type FieldState = { draft: string; value: AddressItem | null };

const DEBOUNCE_DELAY = 300;

const AddressInput = ({
  onFocus,
  onDepartureChange,
  onDestinationChange,
  departureValue = "",
  destinationValue = "",
}: AddressInputProps) => {
  const [focusedInput, setFocusedInput] = useState<Field | null>(null);
  const [fields, setFields] = useState<Record<Field, FieldState>>({
    departure: { draft: departureValue, value: null },
    destination: { draft: destinationValue, value: null },
  });
  const [immediateQuery, setImmediateQuery] = useState<string | null>(null);
  // 현재 포커스된 입력의 draft 값 추출
  const currentDraft = focusedInput ? fields[focusedInput].draft : "";
  const debouncedDraft = useDebounce(currentDraft, DEBOUNCE_DELAY);
  const effectiveQuery = immediateQuery ?? debouncedDraft;

  const { results, isLoading, error } = useAddressSearch({
    query: effectiveQuery,
    enabled: focusedInput !== null && effectiveQuery.trim() !== "",
  });

  const handleInputFocus = (type: Field) => {
    setFocusedInput(type);
    onFocus?.(); // 외부 onFocus 콜백 호출
  };

  const handleKeyDown = (
    type: Field,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (focusedInput === null) setFocusedInput(type);
    const draft = fields[type].draft.trim();
    if (draft) setImmediateQuery(draft);
  };

  useEffect(() => {
    if (immediateQuery !== null) {
      const rafId = requestAnimationFrame(() => setImmediateQuery(null));
      return () => cancelAnimationFrame(rafId);
    }
  }, [immediateQuery]);

  const handleDraftChange = (
    type: Field,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFields((prev) => ({
      ...prev,
      [type]: { ...prev[type], draft: value },
    }));
  };

  const handleItemSelect = (item: AddressItem) => {
    if (!focusedInput) return;

    setFields((prev) => ({
      ...prev,
      [focusedInput]: { draft: item.name, value: item },
    }));

    // 선택된 주소의 addr 값을 외부로 전달
    if (focusedInput === "departure" && onDepartureChange) {
      onDepartureChange(item.addr);
    } else if (focusedInput === "destination" && onDestinationChange) {
      onDestinationChange(item.addr);
    }

    setFocusedInput(null);
  };

  const handleCloseDropdown = () => {
    setFocusedInput(null);
  };

  return (
    <div css={AddrInputContainer}>
      <div css={InputSection}>
        <Input
          label="출발지"
          required
          icon={<SearchIcon fill={color.GrayScale.gray4} />}
          placeholder="탑승 위치 입력"
          value={fields.departure.draft}
          onFocus={() => handleInputFocus("departure")}
          onChange={(e) => handleDraftChange("departure", e)}
          onKeyDown={(e) => handleKeyDown("departure", e)}
        />

        <ThreeDotsIcon style={{ marginTop: "55px" }} />

        <Input
          label="도착지"
          required
          icon={<SearchIcon fill={color.GrayScale.gray4} />}
          placeholder="병원 위치 입력"
          value={fields.destination.draft}
          onFocus={() => handleInputFocus("destination")}
          onChange={(e) => handleDraftChange("destination", e)}
          onKeyDown={(e) => handleKeyDown("destination", e)}
        />
      </div>

      {focusedInput && (
        <AddressDropdown
          type={focusedInput}
          results={results}
          isLoading={isLoading}
          error={error}
          onItemSelect={handleItemSelect}
          onClose={handleCloseDropdown}
        />
      )}
    </div>
  );
};

export default AddressInput;
