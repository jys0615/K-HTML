import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Send, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReportStore } from '@/stores/reportStore';
import { useUIStore } from '@/stores/uiStore';
import { REPORT_CONFIG } from '@/utils/constants';

export const PostReportPage: React.FC = () => {
    const navigate = useNavigate();
    const { location } = useGeolocation();
    const { createReport, isLoading } = useReportStore();
    const { showToast } = useUIStore();

    const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
    const [description, setDescription] = useState('');
    const [selectedTime, setSelectedTime] = useState(() => {
        // 기본값: 30분 전
        const now = new Date();
        now.setMinutes(now.getMinutes() - 30);
        return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm 형식
    });
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [customLocation, setCustomLocation] = useState('');

    const handleSubmit = async () => {
        let reportLocation = location;

        // 커스텀 위치를 사용하는 경우
        if (!useCurrentLocation) {
            if (!customLocation.trim()) {
                showToast('위치를 입력해주세요.');
                return;
            }
            // 간단한 주소 → 좌표 변환 (실제로는 지오코딩 API 사용)
            reportLocation = {
                lat: 37.5665 + (Math.random() - 0.5) * 0.01, // 임시 좌표
                lng: 126.9780 + (Math.random() - 0.5) * 0.01,
                address: customLocation.trim(),
                timestamp: new Date(selectedTime),
            };
        } else if (!location) {
            showToast('현재 위치를 확인할 수 없습니다. 직접 위치를 입력해주세요.');
            return;
        }

        try {
            const reportData = {
                type: 'post' as const,
                location: {
                    ...reportLocation!,
                    timestamp: new Date(selectedTime),
                },
                description: description || getDefaultDescription(selectedLevel, selectedTime),
                trafficLevel: selectedLevel,
            };

            await createReport(reportData);
            showToast('사후 제보가 완료되었습니다!');
            navigate('/');
        } catch (error) {
            showToast('제보 중 오류가 발생했습니다.');
        }
    };

    const getDefaultDescription = (level: number, time: string) => {
        const date = new Date(time);
        const timeStr = date.toLocaleString('ko-KR');
        const descriptions = {
            1: `${timeStr}에 교통이 원활했습니다`,
            2: `${timeStr}에 약간 서행했습니다`,
            3: `${timeStr}에 지체가 있었습니다`,
            4: `${timeStr}에 정체가 발생했습니다`,
            5: `${timeStr}에 극심한 정체가 있었습니다`
        };
        return descriptions[level as keyof typeof descriptions];
    };

    // 시간 옵션 생성 (최근 24시간)
    const getTimeOptions = () => {
        const options = [];
        const now = new Date();

        for (let i = 0; i < 24; i++) {
            const time = new Date(now.getTime() - i * 30 * 60 * 1000); // 30분 간격
            options.push({
                value: time.toISOString().slice(0, 16),
                label: i === 0 ? '지금' : `${Math.floor(i * 0.5)}${i % 2 === 0 ? '시간' : '시간 30분'} 전`,
                fullLabel: time.toLocaleString('ko-KR')
            });
        }
        return options;
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">사후 제보</h1>
                        <p className="text-sm text-gray-600">지나온 길의 상황을 알려주세요</p>
                    </div>
                </div>
            </div>

            {/* 제보 폼 */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* 시간 선택 */}
                <Card className="p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        언제 발생한 상황인가요?
                    </h2>
                    <div className="space-y-3">
                        {/* 빠른 시간 선택 */}
                        <div className="grid grid-cols-3 gap-2">
                            {getTimeOptions().slice(0, 6).map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedTime(option.value)}
                                    className={`p-2 text-sm rounded-lg border-2 transition-colors ${selectedTime === option.value
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* 직접 시간 입력 */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">직접 입력</label>
                            <input
                                type="datetime-local"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                max={new Date().toISOString().slice(0, 16)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </Card>

                {/* 위치 선택 */}
                <Card className="p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        어디에서 발생한 상황인가요?
                    </h2>

                    {/* 현재 위치 사용 */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                checked={useCurrentLocation}
                                onChange={() => setUseCurrentLocation(true)}
                                className="w-4 h-4 text-orange-600"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">현재 위치</p>
                                <p className="text-sm text-gray-600">
                                    {location?.address || (location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '위치 확인 중...')}
                                </p>
                            </div>
                        </label>

                        {/* 직접 위치 입력 */}
                        <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                checked={!useCurrentLocation}
                                onChange={() => setUseCurrentLocation(false)}
                                className="w-4 h-4 text-orange-600 mt-1"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-2">직접 입력</p>
                                <input
                                    type="text"
                                    value={customLocation}
                                    onChange={(e) => setCustomLocation(e.target.value)}
                                    placeholder="예: 강남역 사거리, 서울대교 등"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    disabled={useCurrentLocation}
                                />
                            </div>
                        </label>
                    </div>
                </Card>

                {/* 교통 상황 선택 */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        당시 교통 상황은 어땠나요?
                    </h2>
                    <div className="space-y-3">
                        {REPORT_CONFIG.TRAFFIC_LEVELS.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => setSelectedLevel(level.value as 1 | 2 | 3 | 4 | 5)}
                                className={`w-full p-4 rounded-lg border-2 transition-all ${selectedLevel === level.value
                                        ? 'border-orange-500 bg-orange-50'
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
                                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
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
                        상세 설명 (선택사항)
                    </h3>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="예: 공사로 인한 차로 차단, 사고 발생 등"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows={3}
                        maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {description.length}/200자
                    </p>
                </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className="bg-white border-t border-gray-200 p-4">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!useCurrentLocation && !customLocation.trim())}
                    className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            제보 중...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            사후 제보 완료
                        </>
                    )}
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