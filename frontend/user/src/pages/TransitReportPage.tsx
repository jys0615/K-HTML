import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReportStore } from '@/stores/reportStore';
import { useUIStore } from '@/stores/uiStore';
import { REPORT_CONFIG } from '@/utils/constants';

export const TransitReportPage: React.FC = () => {
    const navigate = useNavigate();
    const { location } = useGeolocation();
    const { createReport, isLoading } = useReportStore();
    const { showToast } = useUIStore();

    const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [busRoute, setBusRoute] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!location) {
            showToast('위치 정보를 확인할 수 없습니다.');
            return;
        }

        if (!busRoute.trim()) {
            showToast('버스 노선번호를 입력해주세요.');
            return;
        }

        try {
            const reportData = {
                type: 'transit' as const,
                location,
                description: description || getDefaultDescription(selectedLevel, busRoute),
                trafficLevel: selectedLevel,
                busRoute: busRoute.trim(),
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

    const getDefaultDescription = (level: number, route: string) => {
        const descriptions = {
            1: `${route}번 버스가 정시 운행중입니다`,
            2: `${route}번 버스가 약간 지연되고 있습니다`,
            3: `${route}번 버스 운행에 지체가 있습니다`,
            4: `${route}번 버스가 많이 지연되고 있습니다`,
            5: `${route}번 버스 운행이 매우 어려운 상황입니다`
        };
        return descriptions[level as keyof typeof descriptions];
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Bus className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">대중교통 제보</h1>
                        <p className="text-sm text-gray-600">버스 운행 상황을 알려주세요</p>
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

            {/* 제보 폼 */}
            <div className="flex-1 p-4 space-y-6">
                {/* 버스 노선 입력 */}
                <Card className="p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                        버스 노선번호
                    </h2>
                    <div className="flex items-center gap-2">
                        <Bus className="w-5 h-5 text-green-600" />
                        <input
                            type="text"
                            value={busRoute}
                            onChange={(e) => setBusRoute(e.target.value)}
                            placeholder="예: 147, 470, 9403"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            maxLength={10}
                        />
                        <span className="text-gray-500">번</span>
                    </div>
                </Card>

                {/* 운행 상황 선택 */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        버스 운행 상황은 어떤가요?
                    </h2>
                    <div className="space-y-3">
                        {REPORT_CONFIG.TRAFFIC_LEVELS.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => setSelectedLevel(level.value as 1 | 2 | 3 | 4 | 5)}
                                className={`w-full p-4 rounded-lg border-2 transition-all ${selectedLevel === level.value
                                        ? 'border-green-500 bg-green-50'
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
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 추가 설명 */}
                <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                        추가 설명 (선택사항)
                    </h3>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="예: 승객이 많아서 지연, 도로 공사로 우회 등"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                    disabled={isLoading || !location || !busRoute.trim()}
                    className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
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

function getColorForLevel(level: number): string {
    const colors = {
        1: '#10B981', 2: '#F59E0B', 3: '#F97316', 4: '#EF4444', 5: '#8B5CF6',
    };
    return colors[level as keyof typeof colors];
}