import { useGetNode } from "@/apis/ScheduleAPI";
import MapCore from "@/features/map/MapCore";

const MapContent = ({ id }: { id: number }) => {
  const { polyline, marker, highlight, bound } = useGetNode(id);

  // 데이터 없는 경우 대비
  const safeMarkerPath = marker ?? [];
  const safePolylinePath = polyline ?? [];
  const safeHighlightPath = highlight ?? [];
  const safeBoundPath = bound ?? {};

  return (
    <MapCore
      markerPath={safeMarkerPath}
      polylinePath={safePolylinePath}
      highlightPath={safeHighlightPath}
      boundPath={safeBoundPath}
    />
  );
};

export default MapContent;
