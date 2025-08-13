import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bus, MapPin, Clock, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUIStore } from '@/stores/uiStore';
import { useGeolocation } from '@/hooks/useGeolocation';

export const ReportSelectPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useUIStore();
    const { location, getCurrentLocation } = useGeolocation();

    const handleReportSelect = async (type: 'driver' | 'transit' | 'post') => {
        if ((type === 'driver' || type === 'transit') && !location) {
            showToast('현재 위치를 확인하는 중입니다...');
            try {
                await getCurrentLocation();
                navigate(`/report/${type}`);
            } catch (error) {
                showToast('위치 정보를 가져올 수 없습니다. 사후 제보를 이용해주세요.');
            }
        } else {
            navigate(`/report/${type}`);
        }
    };

    return (
        // 1. 최상위 div에서 p-4 제거
        <div className="flex flex-col h-full bg-ddm-light">
            {/* 헤더 섹션: 동대문구 테마 색상 적용 */}
            <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-ddm-jaju/10 rounded-full mb-4">
                    <AlertTriangle className="w-8 h-8 text-ddm-jaju" />
                </div>
                <h1 className="text-2xl font-bold text-ddm-jaju mb-2">
                    어떤 상황인가요?
                </h1>
                <p className="text-ddm-gray">
                    현재 상황에 맞는 제보 방식을 선택해주세요
                </p>
            </div>

            {/* 2. 제보 방식 선택 카드들: 하단 패딩(pb-8) 추가, 배경색 제거 */}
            <div className="space-y-4 px-4 pb-8">
                {/* 운전자 제보 */}
                <Card className="p-0 overflow-hidden transition-shadow bg-white hover:shadow-lg">
                    <button
                        onClick={() => handleReportSelect('driver')}
                        className="w-full h-auto p-6 flex items-start justify-start text-left hover:bg-ddm-jaju/5"
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className="flex-shrink-0 w-12 h-12 bg-ddm-jaju/10 rounded-lg flex items-center justify-center">
                                <Car className="w-7 h-7 text-ddm-jaju" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        운전 중이에요
                                    </h3>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ddm-green/20 text-ddm-green">
                                        실시간
                                    </span>
                                </div>
                                <p className="text-sm text-ddm-gray mb-2">
                                    간단한 터치로 빠른 제보
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        30초 소요
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        현재 위치
                                    </span>
                                </div>
                            </div>
                        </div>
                    </button>
                </Card>

                {/* 대중교통 제보 */}
                <Card className="p-0 overflow-hidden transition-shadow bg-white hover:shadow-lg">
                    <button
                        onClick={() => handleReportSelect('transit')}
                        className="w-full h-auto p-6 flex items-start justify-start text-left hover:bg-ddm-bora/5"
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className="flex-shrink-0 w-12 h-12 bg-ddm-bora/10 rounded-lg flex items-center justify-center">
                                <Bus className="w-7 h-7 text-ddm-bora" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        버스 타는 중이에요
                                    </h3>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ddm-green/20 text-ddm-green">
                                        실시간
                                    </span>
                                </div>
                                <p className="text-sm text-ddm-gray mb-2">
                                    노선 정보와 함께 제보
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        1분 소요
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bus className="w-3 h-3" />
                                        노선번호 입력
                                    </span>
                                </div>
                            </div>
                        </div>
                    </button>
                </Card>

                {/* 사후 제보 */}
                <Card className="p-0 overflow-hidden transition-shadow bg-white hover:shadow-lg">
                    <button
                        onClick={() => handleReportSelect('post')}
                        className="w-full h-auto p-6 flex items-start justify-start text-left hover:bg-ddm-blue/5"
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className="flex-shrink-0 w-12 h-12 bg-ddm-blue/10 rounded-lg flex items-center justify-center">
                                <MapPin className="w-7 h-7 text-ddm-blue" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        사후 제보
                                    </h3>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ddm-gray/20 text-ddm-gray">
                                        위치 선택
                                    </span>
                                </div>
                                <p className="text-sm text-ddm-gray mb-2">
                                    지나온 길의 상황 제보
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        2분 소요
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        위치 & 시간 선택
                                    </span>
                                </div>
                            </div>
                        </div>
                    </button>
                </Card>

                {/* 하단 도움말 */}
                <div className="pt-4">
                    <div className="p-4 bg-white rounded-lg border border-ddm-yeonbora/50">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-ddm-jaju mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-ddm-jaju mb-1">
                                    제보 가이드
                                </h4>
                                <ul className="text-xs text-ddm-gray space-y-1">
                                    <li>• <strong>운전 중:</strong> 안전을 위해 간단한 터치만으로 제보</li>
                                    <li>• <strong>대중교통:</strong> 버스 노선 정보로 더 정확한 제보</li>
                                    <li>• <strong>사후 제보:</strong> 언제든지 과거 상황 공유 가능</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 위치 정보 표시 */}
                {location && (
                    <div className="p-3 bg-ddm-green/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-ddm-green" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ddm-green">현재 위치 확인됨</p>
                                <p className="text-xs text-ddm-green/80 truncate">
                                    {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};