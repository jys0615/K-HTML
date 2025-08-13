import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NaverMap } from '@/components/common/Map/NaverMap';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReportStore } from '@/stores/reportStore';
import { useUIStore } from '@/stores/uiStore';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { location, error: locationError, isLoading: locationLoading, getCurrentLocation } = useGeolocation();
    const { loadReports, allReports } = useReportStore();
    const { showToast } = useUIStore();

    // 컴포넌트 마운트 시 제보 데이터 로드
    useEffect(() => {
        loadReports();
    }, [loadReports]);

    // 위치 오류 처리
    useEffect(() => {
        if (locationError) {
            console.warn('위치 오류:', locationError);
            // 토스트는 일단 주석 처리 (너무 자주 뜰 수 있음)
            // showToast(`위치 오류: ${locationError}`);
        }
    }, [locationError, showToast]);

    const handleQuickReport = () => {
        navigate('/report');
    };

    const handleMapClick = () => {
        navigate('/map');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* 지도 영역 */}
            <div className="flex-1 relative min-h-0"> {/* min-h-0 추가 */}
                <NaverMap
                    currentLocation={location}
                    reports={allReports}
                    onMapClick={handleMapClick}
                    className="w-full h-full"
                />

                {/* 현재 위치 표시 */}
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="bg-white rounded-lg shadow-sm border p-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <div className="flex-1 min-w-0">
                                {locationLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm text-gray-600">위치 확인 중...</span>
                                    </div>
                                ) : location?.address ? (
                                    <span className="text-sm font-medium text-gray-900 truncate">
                                        {location.address}
                                    </span>
                                ) : location ? (
                                    <span className="text-sm font-medium text-gray-900">
                                        위도 {location.lat.toFixed(4)}, 경도 {location.lng.toFixed(4)}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500">
                                        위치를 확인할 수 없습니다
                                    </span>
                                )}
                            </div>
                            {!locationLoading && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={getCurrentLocation}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 제보 통계 표시 */}
                <div className="absolute top-20 left-4 right-4 z-10">
                    <div className="bg-white rounded-lg shadow-sm border p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-medium text-gray-900">
                                    실시간 제보
                                </span>
                            </div>
                            <div className="flex gap-4 text-xs">
                                <span className="text-gray-600">
                                    전체: <span className="font-semibold text-gray-900">{allReports.length}</span>
                                </span>
                                <span className="text-gray-600">
                                    오늘: <span className="font-semibold text-gray-900">
                                        {allReports.filter(r => {
                                            const today = new Date().toDateString();
                                            const reportDate = new Date(r.createdAt).toDateString();
                                            return today === reportDate;
                                        }).length}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 액션 영역 */}
            <div className="bg-white border-t border-gray-200 p-4 safe-area-bottom">
                <div className="space-y-3">
                    {/* 메인 제보 버튼 */}
                    <Button
                        onClick={handleQuickReport}
                        className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                        size="lg"
                    >
                        <AlertTriangle className="w-6 h-6 mr-3" />
                        교통 상황 제보하기
                    </Button>

                    {/* 보조 액션들 */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={handleMapClick}
                            className="h-12 flex flex-col gap-1"
                        >
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm">제보 지도</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/report/post')}
                            className="h-12 flex flex-col gap-1"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-sm">사후 제보</span>
                        </Button>
                    </div>
                </div>

                {/* 도움말 텍스트 */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        실시간 교통 상황을 공유하여 모두가 편리한 이동을 도와주세요
                    </p>
                </div>
            </div>
        </div>
    );
};