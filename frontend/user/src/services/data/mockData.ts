import type { Report, Alert } from '@/types/api';

// 서울 주요 지점 좌표
const SEOUL_LOCATIONS = [
    { lat: 37.5665, lng: 126.9780, address: '서울시청' },
    { lat: 37.5510, lng: 126.9882, address: '강남역' },
    { lat: 37.5443, lng: 127.0557, address: '잠실역' },
    { lat: 37.5562, lng: 126.9723, address: '명동' },
    { lat: 37.5797, lng: 126.9770, address: '종로3가' },
];

export const generateMockReports = (count: number = 20): Report[] => {
    const reports: Report[] = [];

    for (let i = 0; i < count; i++) {
        const location = SEOUL_LOCATIONS[Math.floor(Math.random() * SEOUL_LOCATIONS.length)];
        const types: Report['type'][] = ['driver', 'transit', 'post'];
        const type = types[Math.floor(Math.random() * types.length)];

        reports.push({
            id: `report-${Date.now()}-${i}`,
            type,
            location: {
                lat: location.lat + (Math.random() - 0.5) * 0.01,
                lng: location.lng + (Math.random() - 0.5) * 0.01,
                address: location.address,
                timestamp: new Date(),
            },
            description: generateRandomDescription(type),
            trafficLevel: Math.floor(Math.random() * 5) + 1 as 1 | 2 | 3 | 4 | 5,
            createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            userId: `user-${Math.floor(Math.random() * 100)}`,
            ...(type === 'transit' && { busRoute: `${Math.floor(Math.random() * 999) + 1}번` }),
        });
    }

    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const generateRandomDescription = (type: Report['type']): string => {
    const descriptions = {
        driver: [
            '차량 정체가 심해요',
            '사고로 인한 지연',
            '공사로 차로 차단',
            '비로 인한 서행',
            '출퇴근 시간 정체'
        ],
        transit: [
            '버스가 많이 늦어요',
            '승객이 너무 많아요',
            '버스 운행 지연',
            '정류장 대기시간 길어짐',
            '배차간격이 불규칙해요'
        ],
        post: [
            '오전에 정체가 있었어요',
            '어제 이 구간 막혔었음',
            '평소보다 교통량 많음',
            '주말 교통체증 발생',
            '행사로 인한 교통통제'
        ]
    };

    const typeDescriptions = descriptions[type];
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

export const generateMockAlerts = (count: number = 5): Alert[] => {
    const alerts: Alert[] = [];

    for (let i = 0; i < count; i++) {
        const location = SEOUL_LOCATIONS[Math.floor(Math.random() * SEOUL_LOCATIONS.length)];
        const types: Alert['type'][] = ['traffic', 'accident', 'construction'];
        const type = types[Math.floor(Math.random() * types.length)];
        const severities: Alert['severity'][] = ['low', 'medium', 'high'];

        alerts.push({
            id: `alert-${Date.now()}-${i}`,
            type,
            location: {
                lat: location.lat + (Math.random() - 0.5) * 0.01,
                lng: location.lng + (Math.random() - 0.5) * 0.01,
                address: location.address,
            },
            title: generateAlertTitle(type),
            description: generateAlertDescription(type),
            severity: severities[Math.floor(Math.random() * severities.length)],
            createdAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        });
    }

    return alerts;
};

const generateAlertTitle = (type: Alert['type']): string => {
    const titles = {
        traffic: ['교통 정체 발생', '심각한 교통체증', '정체 구간 발생'],
        accident: ['교통사고 발생', '차량 사고', '다중 추돌 사고'],
        construction: ['도로 공사', '차로 통제', '공사로 인한 우회']
    };

    const typeTitles = titles[type];
    return typeTitles[Math.floor(Math.random() * typeTitles.length)];
};

const generateAlertDescription = (type: Alert['type']): string => {
    const descriptions = {
        traffic: ['평소보다 30분 지연 예상', '우회도로 이용 권장', '대중교통 이용 권장'],
        accident: ['현재 처리 중', '경찰 출동 완료', '견인차 대기 중'],
        construction: ['오후 6시까지 진행', '1차로만 통행 가능', '우회로 안내']
    };

    const typeDescriptions = descriptions[type];
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};