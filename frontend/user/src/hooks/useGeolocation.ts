import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/uiStore';
import type { Location } from '@/types/common';

interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    watchPosition?: boolean;
}

interface UseGeolocationReturn {
    location: Location | null;
    error: string | null;
    isLoading: boolean;
    getCurrentLocation: () => Promise<Location>;
    clearError: () => void;
}

export const useGeolocation = (options: GeolocationOptions = {}): UseGeolocationReturn => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setCurrentLocation, setLocationError } = useUIStore();

    const {
        enableHighAccuracy = true,
        timeout = 15000,
        maximumAge = 300000, // 5분
        watchPosition = false,
    } = options;

    const getCurrentLocation = useCallback((): Promise<Location> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const errorMsg = '위치 서비스가 지원되지 않습니다.';
                setError(errorMsg);
                setLocationError(errorMsg);
                reject(new Error(errorMsg));
                return;
            }

            setIsLoading(true);
            setError(null);
            setLocationError(null);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const newLocation: Location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            timestamp: new Date(),
                        };

                        // 역지오코딩으로 주소 가져오기 (선택적)
                        try {
                            const address = await reverseGeocode(newLocation.lat, newLocation.lng);
                            newLocation.address = address;
                        } catch {
                            // 주소 변환 실패는 무시
                        }

                        setLocation(newLocation);
                        setCurrentLocation(newLocation);
                        setIsLoading(false);
                        resolve(newLocation);
                    } catch (err) {
                        const errorMsg = '위치 처리 중 오류가 발생했습니다.';
                        setError(errorMsg);
                        setLocationError(errorMsg);
                        setIsLoading(false);
                        reject(new Error(errorMsg));
                    }
                },
                (err) => {
                    let errorMessage = '위치를 가져올 수 없습니다.';

                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            errorMessage = '위치 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
                            break;
                        case err.POSITION_UNAVAILABLE:
                            errorMessage = '위치 정보를 사용할 수 없습니다.';
                            break;
                        case err.TIMEOUT:
                            errorMessage = '위치 요청이 시간 초과되었습니다.';
                            break;
                    }

                    setError(errorMessage);
                    setLocationError(errorMessage);
                    setIsLoading(false);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy,
                    timeout,
                    maximumAge,
                }
            );
        });
    }, [enableHighAccuracy, timeout, maximumAge, setCurrentLocation, setLocationError]);

    const clearError = useCallback(() => {
        setError(null);
        setLocationError(null);
    }, [setLocationError]);

    // 컴포넌트 마운트 시 위치 가져오기
    useEffect(() => {
        getCurrentLocation().catch(() => {
            // 에러는 이미 상태에 저장됨
        });
    }, [getCurrentLocation]);

    // watchPosition 옵션이 true일 때 위치 추적
    useEffect(() => {
        if (!watchPosition || !navigator.geolocation) return;

        let watchId: number;

        const startWatching = () => {
            watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    try {
                        const newLocation: Location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            timestamp: new Date(),
                        };

                        // 이전 위치와 비교해서 의미있는 변화가 있을 때만 업데이트
                        if (location && calculateDistance(location, newLocation) < 0.01) {
                            return; // 10m 미만의 변화는 무시
                        }

                        try {
                            const address = await reverseGeocode(newLocation.lat, newLocation.lng);
                            newLocation.address = address;
                        } catch {
                            // 주소 변환 실패는 무시
                        }

                        setLocation(newLocation);
                        setCurrentLocation(newLocation);
                    } catch (err) {
                        console.error('위치 추적 중 오류:', err);
                    }
                },
                (err) => {
                    console.error('위치 추적 오류:', err);
                },
                {
                    enableHighAccuracy,
                    timeout,
                    maximumAge,
                }
            );
        };

        startWatching();

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchPosition, enableHighAccuracy, timeout, maximumAge, location, setCurrentLocation]);

    return {
        location,
        error,
        isLoading,
        getCurrentLocation,
        clearError,
    };
};

// 네이버 지도 API를 사용한 역지오코딩
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
            throw new Error('네이버 지도 서비스가 로드되지 않았습니다.');
        }

        return new Promise((resolve, reject) => {
            window.naver.maps.Service.reverseGeocode({
                coords: new window.naver.maps.LatLng(lat, lng),
            }, (status: any, response: any) => {
                if (status === window.naver.maps.Service.Status.ERROR) {
                    reject(new Error('주소 변환 실패'));
                    return;
                }

                if (response.v2?.results?.length > 0) {
                    const result = response.v2.results[0];
                    const address = result.region?.area1?.name + ' ' +
                        result.region?.area2?.name + ' ' +
                        result.region?.area3?.name;
                    resolve(address.trim());
                } else {
                    reject(new Error('주소를 찾을 수 없습니다.'));
                }
            });
        });
    } catch (error) {
        // 네이버 지도 API가 없으면 기본 주소 반환
        return `위도 ${lat.toFixed(4)}, 경도 ${lng.toFixed(4)}`;
    }
}

// 두 위치 간의 거리 계산 (km)
function calculateDistance(pos1: Location, pos2: Location): number {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}