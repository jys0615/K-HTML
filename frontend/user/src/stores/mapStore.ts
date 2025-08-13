import { create } from 'zustand';
import type { LatLng, Report, Alert } from '@/types/api';
import type { MapMarker } from '@/types/map';

interface MapState {
    // 지도 인스턴스 (any로 임시 처리)
    map: any | null;
    isMapLoaded: boolean;

    // 지도 상태
    center: LatLng;
    zoom: number;

    // 마커 데이터
    reports: Report[];
    alerts: Alert[];
    markers: MapMarker[];

    // 선택된 요소
    selectedReport: Report | null;
    selectedAlert: Alert | null;

    // 필터링
    showReports: boolean;
    showAlerts: boolean;
    reportTypeFilter: ('driver' | 'transit' | 'post')[];
    trafficLevelFilter: (1 | 2 | 3 | 4 | 5)[];

    // Actions
    setMap: (map: any | null) => void;
    setMapLoaded: (loaded: boolean) => void;
    setCenter: (center: LatLng) => void;
    setZoom: (zoom: number) => void;

    // 데이터 관리
    setReports: (reports: Report[]) => void;
    addReport: (report: Report) => void;
    removeReport: (reportId: string) => void;
    setAlerts: (alerts: Alert[]) => void;

    // 선택 관리
    selectReport: (report: Report | null) => void;
    selectAlert: (alert: Alert | null) => void;
    clearSelection: () => void;

    // 필터링
    toggleReportsVisibility: () => void;
    toggleAlertsVisibility: () => void;
    setReportTypeFilter: (types: ('driver' | 'transit' | 'post')[]) => void;
    setTrafficLevelFilter: (levels: (1 | 2 | 3 | 4 | 5)[]) => void;

    // 유틸리티
    updateMarkers: () => void;
    moveToLocation: (location: LatLng, zoom?: number) => void;
    fitBounds: (locations: LatLng[]) => void;
}

// 서울 시청 기본 좌표
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.9780 };
const DEFAULT_ZOOM = 15;

export const useMapStore = create<MapState>((set, get) => ({
    // Initial state
    map: null,
    isMapLoaded: false,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    reports: [],
    alerts: [],
    markers: [],
    selectedReport: null,
    selectedAlert: null,
    showReports: true,
    showAlerts: true,
    reportTypeFilter: ['driver', 'transit', 'post'],
    trafficLevelFilter: [1, 2, 3, 4, 5],

    // Map instance management
    setMap: (map) => {
        set({ map });
        if (map && window.naver && window.naver.maps) {
            // 지도 이벤트 리스너 등록 (naver가 있을 때만)
            try {
                window.naver.maps.Event.addListener(map, 'center_changed', () => {
                    const center = map.getCenter();
                    set({ center: { lat: center.y, lng: center.x } });
                });

                window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
                    set({ zoom: map.getZoom() });
                });
            } catch (error) {
                console.warn('지도 이벤트 리스너 등록 실패:', error);
            }
        }
    },

    setMapLoaded: (loaded) => set({ isMapLoaded: loaded }),

    setCenter: (center) => {
        set({ center });
        const { map } = get();
        if (map && window.naver && window.naver.maps) {
            try {
                map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
            } catch (error) {
                console.warn('지도 중심 이동 실패:', error);
            }
        }
    },

    setZoom: (zoom) => {
        set({ zoom });
        const { map } = get();
        if (map && window.naver && window.naver.maps) {
            try {
                map.setZoom(zoom);
            } catch (error) {
                console.warn('지도 줌 변경 실패:', error);
            }
        }
    },

    // Data management
    setReports: (reports) => {
        set({ reports });
        get().updateMarkers();
    },

    addReport: (report) => {
        const { reports } = get();
        const updatedReports = [report, ...reports];
        set({ reports: updatedReports });
        get().updateMarkers();
    },

    removeReport: (reportId) => {
        const { reports } = get();
        const updatedReports = reports.filter(r => r.id !== reportId);
        set({ reports: updatedReports });
        get().updateMarkers();
    },

    setAlerts: (alerts) => {
        set({ alerts });
        get().updateMarkers();
    },

    // Selection management
    selectReport: (report) => {
        set({ selectedReport: report, selectedAlert: null });
        if (report && get().map) {
            get().moveToLocation(report.location, 16);
        }
    },

    selectAlert: (alert) => {
        set({ selectedAlert: alert, selectedReport: null });
        if (alert && get().map) {
            get().moveToLocation(alert.location, 16);
        }
    },

    clearSelection: () => {
        set({ selectedReport: null, selectedAlert: null });
    },

    // Filtering
    toggleReportsVisibility: () => {
        set(state => ({ showReports: !state.showReports }));
        get().updateMarkers();
    },

    toggleAlertsVisibility: () => {
        set(state => ({ showAlerts: !state.showAlerts }));
        get().updateMarkers();
    },

    setReportTypeFilter: (types) => {
        set({ reportTypeFilter: types });
        get().updateMarkers();
    },

    setTrafficLevelFilter: (levels) => {
        set({ trafficLevelFilter: levels });
        get().updateMarkers();
    },

    // Utilities
    updateMarkers: () => {
        const state = get();
        const markers: MapMarker[] = [];

        // 제보 마커 추가
        if (state.showReports) {
            const filteredReports = state.reports.filter(report =>
                state.reportTypeFilter.includes(report.type) &&
                state.trafficLevelFilter.includes(report.trafficLevel)
            );

            filteredReports.forEach(report => {
                markers.push({
                    id: `report-${report.id}`,
                    position: report.location,
                    type: 'report',
                    data: report,
                });
            });
        }

        // 알림 마커 추가
        if (state.showAlerts) {
            state.alerts.forEach(alert => {
                markers.push({
                    id: `alert-${alert.id}`,
                    position: alert.location,
                    type: 'alert',
                    data: alert,
                });
            });
        }

        set({ markers });
    },

    moveToLocation: (location, zoom) => {
        const { map } = get();
        if (map && window.naver && window.naver.maps) {
            try {
                map.setCenter(new window.naver.maps.LatLng(location.lat, location.lng));
                if (zoom) {
                    map.setZoom(zoom);
                }
            } catch (error) {
                console.warn('위치 이동 실패:', error);
            }
        }
        set({ center: location, ...(zoom && { zoom }) });
    },

    fitBounds: (locations) => {
        const { map } = get();
        if (map && window.naver && window.naver.maps && locations.length > 0) {
            try {
                const bounds = new window.naver.maps.LatLngBounds();
                locations.forEach(location => {
                    bounds.extend(new window.naver.maps.LatLng(location.lat, location.lng));
                });
                map.fitBounds(bounds);
            } catch (error) {
                console.warn('경계 조정 실패:', error);
            }
        }
    },
}));