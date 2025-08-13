import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReportStore } from '@/stores/reportStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { REPORT_CONFIG } from '@/utils/constants';
import type { Report } from '@/types/api';
import { NaverMap } from '@/components/common/Map/NaverMap';

export const ReportMapPage: React.FC = () => {
    const navigate = useNavigate();
    const { allReports, loadReports } = useReportStore();
    const { location } = useGeolocation();

    const [showFilters, setShowFilters] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<('driver' | 'transit' | 'post')[]>(['driver', 'transit', 'post']);
    const [selectedLevels, setSelectedLevels] = useState<(1 | 2 | 3 | 4 | 5)[]>([1, 2, 3, 4, 5]);
    const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'recent'>('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const filteredReports = allReports.filter(report => {
        if (!selectedTypes.includes(report.type)) return false;
        if (!selectedLevels.includes(report.trafficLevel)) return false;

        const reportDate = new Date(report.createdAt);
        const now = new Date();
        switch (timeFilter) {
            case 'today':
                return reportDate.toDateString() === now.toDateString();
            case 'recent':
                return (now.getTime() - reportDate.getTime()) < (6 * 60 * 60 * 1000); // 6시간
            default:
                return true;
        }
    });

    const toggleTypeFilter = (type: 'driver' | 'transit' | 'post') => {
        setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    const toggleLevelFilter = (level: 1 | 2 | 3 | 4 | 5) => {
        setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
    };

    const getReportIcon = (type: Report['type']) => {
        switch (type) {
            case 'driver': return '🚗';
            case 'transit': return '🚌';
            case 'post': return '📍';
            default: return '❓';
        }
    };

    const getColorForLevel = (level: number): string => {
        const colors: { [key: number]: string } = {
            1: '#006C67', // 소나무초록
            2: '#C5A32A', // 동대문금색
            3: '#83357A', // 동대문보라
            4: '#AF1C61', // 동대문자주
            5: '#224772', // 쪽빛기와청색
        };
        return colors?.[level] || '#757067'; // 회색
    };

    const getTimeDifference = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return '방금';
    };

    return (
        <div className="flex flex-col h-full bg-ddm-light-gray">
            <div className="flex-1 relative">
                <NaverMap
                    className="w-full h-full"
                    currentLocation={location}
                    reports={filteredReports}
                    onMarkerClick={(report) => {
                        setSelectedReport(report);
                        setShowFilters(false);
                    }}
                />

                <div className="absolute top-4 right-4 z-10">
                    <Button
                        onClick={() => {
                            setShowFilters(!showFilters);
                            setSelectedReport(null);
                        }}
                        variant={showFilters ? "default" : "outline"}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        필터 ({filteredReports.length})
                    </Button>
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                    <Button
                        onClick={() => navigate('/report')}
                        size="icon"
                        className="w-14 h-14 rounded-full shadow-lg"
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                <div className="p-4 pointer-events-auto">
                    {showFilters && (
                        <Card className="bg-white shadow-lg"> {/* ✨ 핵심 수정 부분 */}
                            <div className="p-4">
                                <h3 className="font-semibold text-ddm-jaju mb-3">필터 설정</h3>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">제보 유형</p>
                                    <div className="flex gap-2">
                                        {REPORT_CONFIG.REPORT_TYPES.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => toggleTypeFilter(type.value as any)}
                                                className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${selectedTypes.includes(type.value as any) ? 'border-ddm-blue bg-ddm-blue/10 text-ddm-blue font-semibold' : 'border-gray-300 text-gray-600'}`}
                                            >
                                                {type.icon} {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">정체 수준</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {REPORT_CONFIG.TRAFFIC_LEVELS.map((level) => (
                                            <button
                                                key={level.value}
                                                onClick={() => toggleLevelFilter(level.value as any)}
                                                className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${selectedLevels.includes(level.value as any) ? 'border-ddm-jaju bg-ddm-jaju/10 text-ddm-jaju font-semibold' : 'border-gray-300 text-gray-600'}`}
                                            >
                                                <div className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getColorForLevel(level.value) }} />
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">시간</p>
                                    <div className="flex gap-2">
                                        {[{ value: 'all', label: '전체' }, { value: 'today', label: '오늘' }, { value: 'recent', label: '최근 6시간' }].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setTimeFilter(option.value as any)}
                                                className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${timeFilter === option.value ? 'border-ddm-green bg-ddm-green/10 text-ddm-green font-semibold' : 'border-gray-300 text-gray-600'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Button onClick={() => setShowFilters(false)} variant="outline" className="w-full">
                                    닫기
                                </Button>
                            </div>
                        </Card>
                    )}

                    {selectedReport && !showFilters && (
                        <Card className="bg-white shadow-lg">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: getColorForLevel(selectedReport.trafficLevel) }}>
                                            {getReportIcon(selectedReport.type)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg" style={{ color: getColorForLevel(selectedReport.trafficLevel) }}>
                                                {REPORT_CONFIG.TRAFFIC_LEVELS.find(l => l.value === selectedReport.trafficLevel)?.label}
                                                {selectedReport.type === 'transit' && selectedReport.busRoute && ` (${selectedReport.busRoute})`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {getTimeDifference(selectedReport.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setSelectedReport(null)}>
                                        ✕
                                    </Button>
                                </div>
                                <p className="text-gray-800 mb-3">{selectedReport.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                        {selectedReport.location.address || `${selectedReport.location.lat.toFixed(4)}, ${selectedReport.location.lng.toFixed(4)}`}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};