import React, { useRef, useEffect } from 'react';
import type { Report, Location } from '@/types/api';

/**
 * NaverMap 컴포넌트가 받는 Props 타입 정의
 */
interface NaverMapProps {
    className?: string;
    currentLocation?: Location | null;
    reports?: Report[];
    onMapClick?: () => void;
    onMarkerClick?: (report: Report) => void;
}

// 헬퍼 함수: 제보 타입에 맞는 아이콘 반환
const getReportIcon = (type: Report['type']) => {
    switch (type) {
        case 'driver': return '🚗';
        case 'transit': return '🚌';
        case 'post': return '📍';
        default: return '❓';
    }
};

// 헬퍼 함수: 정체 수준에 맞는 색상 반환
const getColorForLevel = (level: number): string => {
    const colors: { [key: number]: string } = {
        1: '#10B981', // 원활 (녹색)
        2: '#F59E0B', // 서행 (노란색)
        3: '#F97316', // 지체 (주황색)
        4: '#EF4444', // 정체 (빨간색)
        5: '#8B5CF6', // 심각 (보라색)
    };
    return colors[level] || '#6B7280'; // 기본 회색
};


/**
 * 실제 네이버 지도 API를 호출하여 지도를 렌더링하는 컴포넌트
 */
export const NaverMap: React.FC<NaverMapProps> = ({
    className,
    currentLocation,
    reports = [],
    onMapClick,
    onMarkerClick,
}) => {
    // 지도를 렌더링할 DOM 요소를 참조
    const mapElement = useRef<HTMLDivElement>(null);
    // 생성된 지도 인스턴스를 저장하여 재사용
    const mapRef = useRef<naver.maps.Map | null>(null);
    // 지도 위에 표시된 마커들의 인스턴스를 저장
    const markersRef = useRef<naver.maps.Marker[]>([]);

    // 1. 지도 인스턴스 초기 생성 및 설정 Hook
    useEffect(() => {
        if (!mapElement.current || !window.naver?.maps) {
            // DOM 요소나 네이버 지도 API 스크립트가 준비되지 않았으면 중단
            return;
        }

        const center = currentLocation
            ? new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng)
            : new window.naver.maps.LatLng(37.5665, 126.9780); // 기본 위치: 서울시청

        // 지도 인스턴스 생성
        const map = new window.naver.maps.Map(mapElement.current, {
            center: center,
            zoom: 15,
            zoomControl: true,
            mapDataControl: false, // 불필요한 컨트롤 제거
        });

        // 지도를 클릭했을 때의 이벤트 리스너 추가
        if (onMapClick) {
            window.naver.maps.Event.addListener(map, 'click', onMapClick);
        }

        // 생성된 지도 인스턴스를 ref에 저장
        mapRef.current = map;

        // 컴포넌트가 언마운트될 때 지도 인스턴스 파괴 (메모리 누수 방지)
        return () => {
            map.destroy();
        };

    }, []); // 이 Hook은 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.


    // 2. 제보 데이터(reports)가 변경될 때마다 마커를 새로 그리는 Hook
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !reports) {
            // 지도 인스턴스나 제보 데이터가 없으면 중단
            return;
        }

        // --- 마커 정리 ---
        // 이전에 생성했던 마커가 있다면 지도에서 모두 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        // 마커 배열 비우기
        markersRef.current = [];

        // --- 새 마커 생성 ---
        // 새로운 제보 데이터를 기반으로 마커들을 생성하여 지도에 추가
        reports.forEach(report => {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(report.location.lat, report.location.lng),
                map: map,
                icon: {
                    // HTML을 사용해 동적으로 마커 스타일링
                    content: `
            <div style="
              background-color: ${getColorForLevel(report.trafficLevel)};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              transition: transform 0.1s ease-in-out;"
              onmouseover="this.style.transform='scale(1.1)';"
              onmouseout="this.style.transform='scale(1)';"
            >
              ${getReportIcon(report.type)}
            </div>
          `,
                    // 아이콘의 중심점을 지정
                    anchor: new window.naver.maps.Point(16, 16),
                },
            });

            // 각 마커에 클릭 이벤트 리스너 추가
            if (onMarkerClick) {
                window.naver.maps.Event.addListener(marker, 'click', () => {
                    onMarkerClick(report); // 클릭된 마커의 제보 정보를 부모 컴포넌트로 전달
                });
            }

            // 새로 생성된 마커를 ref 배열에 추가하여 다음 업데이트 시 제거할 수 있도록 관리
            markersRef.current.push(marker);
        });

    }, [reports, onMarkerClick]); // 'reports'나 'onMarkerClick' prop이 변경될 때마다 이 Hook이 실행됩니다.


    // 3. 현재 위치가 변경되면 지도의 중심을 부드럽게 이동시키는 Hook
    useEffect(() => {
        if (mapRef.current && currentLocation) {
            const newLocation = new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
            mapRef.current.panTo(newLocation); // 부드럽게 이동
        }
    }, [currentLocation]);


    // 실제 지도가 렌더링될 DOM 요소를 반환
    return <div ref={mapElement} className={className} />;
};