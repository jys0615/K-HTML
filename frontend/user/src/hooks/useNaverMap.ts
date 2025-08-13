import { useEffect, useRef, useState, useCallback } from 'react';
import { useMapStore } from '@/stores/mapStore';
import type { LatLng } from '@/types/api';

interface UseNaverMapOptions {
    containerId: string;
    center?: LatLng;
    zoom?: number;
    onMapLoad?: (map: any) => void;  // any로 변경
    onMarkerClick?: (marker: any, data: any) => void;
}

interface UseNaverMapReturn {
    map: any | null;  // any로 변경
    isLoaded: boolean;
    error: string | null;
    createMarker: (position: LatLng, options?: any) => any | null;  // any로 변경
    removeMarker: (marker: any) => void;  // any로 변경
    fitBounds: (positions: LatLng[]) => void;
    moveToLocation: (position: LatLng, zoom?: number) => void;
}

export const useNaverMap = (options: UseNaverMapOptions): UseNaverMapReturn => {
    const {
        containerId,
        center = { lat: 37.5665, lng: 126.9780 }, // 서울시청
        zoom = 15,
        onMapLoad,
        onMarkerClick,
    } = options;

    const mapRef = useRef<any | null>(null);  // any로 변경
    const markersRef = useRef<any[]>([]);     // any로 변경
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setMap, setMapLoaded, setCenter, setZoom } = useMapStore();

    // 네이버 지도 초기화
    useEffect(() => {
        const initializeMap = () => {
            try {
                if (!window.naver || !window.naver.maps) {
                    setError('네이버 지도 API가 로드되지 않았습니다.');
                    return;
                }

                const container = document.getElementById(containerId);
                if (!container) {
                    setError(`지도 컨테이너를 찾을 수 없습니다: ${containerId}`);
                    return;
                }

                const mapOptions = {  // 타입 제거
                    center: new window.naver.maps.LatLng(center.lat, center.lng),
                    zoom,
                    minZoom: 10,
                    maxZoom: 19,
                    mapTypeControl: false,
                    logoControl: false,
                    scaleControl: true,
                    mapDataControl: false,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: window.naver.maps.Position.TOP_RIGHT,
                    },
                };

                const mapInstance = new window.naver.maps.Map(container, mapOptions);
                mapRef.current = mapInstance;

                // 지도 이벤트 리스너 등록
                setupMapEvents(mapInstance);

                // 스토어에 지도 인스턴스 저장
                setMap(mapInstance);
                setMapLoaded(true);
                setIsLoaded(true);
                setError(null);

                // 콜백 호출
                onMapLoad?.(mapInstance);

                console.log('네이버 지도 초기화 완료');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : '지도 초기화 실패';
                setError(errorMessage);
                console.error('네이버 지도 초기화 오류:', err);
            }
        };

        // 네이버 지도 API 로드 확인
        if (window.naver && window.naver.maps) {
            initializeMap();
        } else {
            // 주기적으로 API 로드 상태 확인
            const checkInterval = setInterval(() => {
                if (window.naver && window.naver.maps) {
                    clearInterval(checkInterval);
                    initializeMap();
                }
            }, 100);

            // 10초 후에도 로드되지 않으면 에러 처리
            const timeoutId = setTimeout(() => {
                clearInterval(checkInterval);
                setError('네이버 지도 API 로드 시간 초과');
            }, 10000);

            return () => {
                clearInterval(checkInterval);
                clearTimeout(timeoutId);
            };
        }

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (mapRef.current && window.naver && window.naver.maps) {
                try {
                    // 이벤트 리스너 제거
                    window.naver.maps.Event.clearInstanceListeners(mapRef.current);
                    // 마커 정리
                    markersRef.current.forEach(marker => {
                        try {
                            marker.setMap(null);
                        } catch (e) {
                            console.warn('마커 정리 중 오류:', e);
                        }
                    });
                    markersRef.current = [];
                } catch (e) {
                    console.warn('지도 정리 중 오류:', e);
                }
            }
        };
    }, [containerId, center.lat, center.lng, zoom, onMapLoad, setMap, setMapLoaded]);

    // 지도 이벤트 설정
    const setupMapEvents = useCallback((map: any) => {  // any로 변경
        if (!window.naver || !window.naver.maps) return;

        try {
            // 중심점 변경 이벤트
            window.naver.maps.Event.addListener(map, 'center_changed', () => {
                const center = map.getCenter();
                setCenter({ lat: center.y, lng: center.x });
            });

            // 줌 변경 이벤트
            window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
                setZoom(map.getZoom());
            });

            // 지도 클릭 이벤트
            window.naver.maps.Event.addListener(map, 'click', (e: any) => {
                console.log('지도 클릭:', e.coord.y, e.coord.x);
            });
        } catch (err) {
            console.error('지도 이벤트 설정 오류:', err);
        }
    }, [setCenter, setZoom]);

    // 마커 생성
    const createMarker = useCallback((position: LatLng, options: any = {}): any | null => {
        if (!mapRef.current || !window.naver || !window.naver.maps) return null;

        try {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(position.lat, position.lng),
                map: mapRef.current,
                ...options,
            });

            // 마커 클릭 이벤트
            if (onMarkerClick) {
                window.naver.maps.Event.addListener(marker, 'click', () => {
                    onMarkerClick(marker, options.data);
                });
            }

            markersRef.current.push(marker);
            return marker;
        } catch (err) {
            console.error('마커 생성 오류:', err);
            return null;
        }
    }, [onMarkerClick]);

    // 마커 제거
    const removeMarker = useCallback((marker: any) => {
        try {
            marker.setMap(null);
            markersRef.current = markersRef.current.filter(m => m !== marker);
        } catch (err) {
            console.error('마커 제거 오류:', err);
        }
    }, []);

    // 경계에 맞춰 지도 조정
    const fitBounds = useCallback((positions: LatLng[]) => {
        if (!mapRef.current || positions.length === 0 || !window.naver || !window.naver.maps) return;

        try {
            const bounds = new window.naver.maps.LatLngBounds();
            positions.forEach(pos => {
                bounds.extend(new window.naver.maps.LatLng(pos.lat, pos.lng));
            });
            mapRef.current.fitBounds(bounds);
        } catch (err) {
            console.error('경계 조정 오류:', err);
        }
    }, []);

    // 특정 위치로 이동
    const moveToLocation = useCallback((position: LatLng, newZoom?: number) => {
        if (!mapRef.current || !window.naver || !window.naver.maps) return;

        try {
            mapRef.current.setCenter(new window.naver.maps.LatLng(position.lat, position.lng));
            if (newZoom !== undefined) {
                mapRef.current.setZoom(newZoom);
            }
        } catch (err) {
            console.error('위치 이동 오류:', err);
        }
    }, []);

    return {
        map: mapRef.current,
        isLoaded,
        error,
        createMarker,
        removeMarker,
        fitBounds,
        moveToLocation,
    };
};