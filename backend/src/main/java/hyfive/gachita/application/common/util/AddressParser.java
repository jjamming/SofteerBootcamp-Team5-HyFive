package hyfive.gachita.application.common.util;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AddressParser {

    // 행정구역 제거 패턴 (더 포괄적으로)
    private static final Pattern ADMINISTRATIVE_AREA_PATTERN = Pattern.compile(
            "^.*?(?:특별시|광역시|특별자치시|특별자치도|도)\\s+.*?(?:구|군|시)\\s+",
            Pattern.CASE_INSENSITIVE
    );

    // 시/도 없이 구/군/시만 있는 경우
    private static final Pattern SUB_ADMINISTRATIVE_AREA_PATTERN = Pattern.compile(
            "^.*?(?:구|군|시)\\s+",
            Pattern.CASE_INSENSITIVE
    );

    // 도로명 주소 패턴 (도로명부터 시작하여 끝까지)
    private static final Pattern ROAD_ADDRESS_PATTERN = Pattern.compile(
            "([가-힣\\d]+(?:로|길|대로|가|거리).*)",
            Pattern.CASE_INSENSITIVE
    );

    public static Optional<String> extractRoadAddress(String address) {
        if (address == null || address.isBlank()) {
            return Optional.empty();
        }

        String trimmed = address.trim();

        // 1차 시도: 행정구역(시/도 + 구/군/시) 제거
        String withoutAdmin = ADMINISTRATIVE_AREA_PATTERN.matcher(trimmed).replaceFirst("");

        // 2차 시도: 구/군/시만 있는 경우 제거 (시/도가 없는 경우)
        if (withoutAdmin.equals(trimmed)) {
            withoutAdmin = SUB_ADMINISTRATIVE_AREA_PATTERN.matcher(trimmed).replaceFirst("");
        }

        // 3차 시도: 도로명부터 시작하는 패턴 매칭
        Matcher matcher = ROAD_ADDRESS_PATTERN.matcher(withoutAdmin.trim());
        if (matcher.find() && matcher.group(1) != null) {
            String roadPart = matcher.group(1).trim();
            if (isValidRoadAddress(roadPart)) {
                return Optional.of(roadPart);
            }
        }

        // 4차 시도: 이미 처리된 문자열이 도로명 주소인지 확인
        String cleaned = withoutAdmin.trim();
        if (isValidRoadAddress(cleaned)) {
            return Optional.of(cleaned);
        }

        return Optional.empty();
    }

    private static boolean isValidRoadAddress(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) {
            return false;
        }

        // 도로명 주소의 특징적인 단어들이 포함되어 있는지 확인
        return roadAddress.matches(".*(?:로|길|대로|가|거리).*") &&
                roadAddress.length() > 2; // 너무 짧지 않아야 함
    }
}