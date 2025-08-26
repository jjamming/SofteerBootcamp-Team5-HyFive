package hyfive.gachita.application.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.List;

public class AddressRestriction {
    // 노원구 관련 패턴들
    private static final List<String> NOWON_PATTERNS = Arrays.asList(
            "노원구",
            "nowon",
            "nowon-gu",
            "nowongu"
    );

    // 구 단위를 추출하는 정규식
    private static final Pattern GU_PATTERN = Pattern.compile("([가-힣]+구)");

    public static boolean isNotServiceRegion(String address) {
        if (address == null || address.trim().isEmpty()) {
            return true;
        }

        // 구 단위를 정확히 추출
        Matcher matcher = GU_PATTERN.matcher(address);

        // 매칭된 구들 중에 노원구가 있는지 확인
        while (matcher.find()) {
            String gu = matcher.group(1);
            if ("노원구".equals(gu)) {
                return false;
            }
        }

        return true;
    }
}
