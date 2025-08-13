import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Clock, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReportStore } from '@/stores/reportStore';
import { useUIStore } from '@/stores/uiStore';
import { REPORT_CONFIG } from '@/utils/constants';

export const DriverReportPage: React.FC = () => {
    const navigate = useNavigate();
    const { location } = useGeolocation();
    const { createReport, isLoading } = useReportStore();
    const { showToast } = useUIStore();

    const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [description, setDescription] = useState('');
    const [showSafetyWarning, setShowSafetyWarning] = useState(true);

    // 안전 경고 3초 후 자동 닫기
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSafetyWarning(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async () => {
        if (!location) {
            showToast('위치 정보를 확인할 수 없습니다.');
            return;
        }

        try {
            const reportData = {
                type: 'driver' as const,
                location,
                description: description || getDefaultDescription(selectedLevel),
                trafficLevel: selectedLevel,
            };

            await createReport(reportData);
            showToast('제보가 완료되었습니다!');
            navigate('/');
        } catch (error) {
            showToast('제보 중 오류가 발생했습니다.');
        }
    };

    const handleLater = () => {
        showToast('60분 후 리마인드 알림을 보내드립니다.');
        navigate('/');
    };

    const getDefaultDescription = (level: number) => {
        const descriptions = {
            1: '교통이 원활합니다',
            2: '약간 서행하고 있습니다',
            3: '지체되고 있습니다',
            4: '정체가 발생했습니다',
            5: '극심한 정체입니다'
        };
        return descriptions[level as keyof typeof descriptions];
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* 안전 경고 모달 */}
            {showSafetyWarning && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    {/* 👇 Card의 className에 테두리 색상을 'border-ddm-yeonbora'로 변경했습니다. */}
                    <Card className="p-6 max-w-sm w-full border border-ddm-yeonbora">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-ddm-jaju mb-2">
                                안전 운전 우선!
                            </h3>
                            <p className="text-sm text-ddm-gray mb-6">
                                운전 중에는 간단한 터치만으로 제보해주세요.
                                <br />
                                안전이 최우선입니다.
                            </p>
                            <Button
                                onClick={() => setShowSafetyWarning(false)}
                                className="w-full"
                            >
                                알겠습니다
                            </Button>
                        </div>
                    </Card>
                </div>
            )}


            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">운전자 제보</h1>
                        <p className="text-sm text-gray-600">현재 교통 상황을 알려주세요</p>
                    </div>
                </div>
            </div>

            {/* 현재 위치 */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">현재 위치</p>
                        <p className="text-xs text-gray-600">
                            {location?.address || (location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '위치 확인 중...')}
                        </p>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* 정체 수준 선택 */}
            <div className="flex-1 p-4 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        교통 상황은 어떤가요?
                    </h2>
                    <div className="space-y-3">
                        {REPORT_CONFIG.TRAFFIC_LEVELS.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => setSelectedLevel(level.value as 1 | 2 | 3 | 4 | 5)}
                                className={`w-full p-4 rounded-lg border-2 transition-all ${selectedLevel === level.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-4 h-4 rounded-full`}
                                            style={{ backgroundColor: getColorForLevel(level.value) }}
                                        />
                                        <span className="font-medium text-gray-900">{level.label}</span>
                                    </div>
                                    {selectedLevel === level.value && (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 추가 설명 (선택) */}
                <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                        추가 설명 (선택사항)
                    </h3>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="예: 사고로 인한 정체, 공사 구간 등"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {description.length}/200자
                    </p>
                </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className="bg-white border-t border-gray-200 p-4 space-y-3">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !location}
                    className="w-full h-12 text-base font-semibold"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            제보 중...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            제보하기
                        </>
                    )}
                </Button>

                <Button
                    variant="outline"
                    onClick={handleLater}
                    className="w-full h-10"
                >
                    나중에 제보할게요
                </Button>
            </div>
        </div>
    );
};

// 색상 헬퍼 함수
function getColorForLevel(level: number): string {
    const colors = {
        1: '#10B981', // green
        2: '#F59E0B', // yellow
        3: '#F97316', // orange
        4: '#EF4444', // red
        5: '#8B5CF6', // purple
    };
    return colors[level as keyof typeof colors];
}