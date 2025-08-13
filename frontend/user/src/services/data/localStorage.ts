import type { Report, CreateReportRequest } from '@/types/api';

const STORAGE_KEYS = {
    REPORTS: 'dongmunseodap_reports',
    USER_REPORTS: 'dongmunseodap_user_reports',
    USER_SETTINGS: 'dongmunseodap_settings',
} as const;

// 제보 관련 로컬 스토리지 관리
export const reportsStorage = {
    // 모든 제보 가져오기
    getAll: (): Report[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    // 제보 저장
    save: (reports: Report[]): void => {
        try {
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
        } catch (error) {
            console.error('Failed to save reports:', error);
        }
    },

    // 새 제보 추가
    add: (reportData: CreateReportRequest): Report => {
        const newReport: Report = {
            ...reportData,
            id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            userId: 'current-user', // 실제로는 로그인 사용자 ID
        };

        const existingReports = reportsStorage.getAll();
        const updatedReports = [newReport, ...existingReports];
        reportsStorage.save(updatedReports);

        // 사용자 제보 기록도 저장
        userReportsStorage.add(newReport.id);

        return newReport;
    },

    // 특정 제보 가져오기
    getById: (id: string): Report | null => {
        const reports = reportsStorage.getAll();
        return reports.find(report => report.id === id) || null;
    },

    // 제보 삭제
    remove: (id: string): boolean => {
        const reports = reportsStorage.getAll();
        const filteredReports = reports.filter(report => report.id !== id);

        if (filteredReports.length !== reports.length) {
            reportsStorage.save(filteredReports);
            userReportsStorage.remove(id);
            return true;
        }

        return false;
    },

    // 위치 기반 제보 검색
    getByLocation: (center: { lat: number; lng: number }, radiusKm: number = 5): Report[] => {
        const reports = reportsStorage.getAll();
        return reports.filter(report => {
            const distance = calculateDistance(
                center.lat, center.lng,
                report.location.lat, report.location.lng
            );
            return distance <= radiusKm;
        });
    },
};

// 사용자 제보 ID 관리
export const userReportsStorage = {
    getAll: (): string[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER_REPORTS);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    add: (reportId: string): void => {
        const userReports = userReportsStorage.getAll();
        if (!userReports.includes(reportId)) {
            userReports.unshift(reportId);
            localStorage.setItem(STORAGE_KEYS.USER_REPORTS, JSON.stringify(userReports));
        }
    },

    remove: (reportId: string): void => {
        const userReports = userReportsStorage.getAll();
        const filtered = userReports.filter(id => id !== reportId);
        localStorage.setItem(STORAGE_KEYS.USER_REPORTS, JSON.stringify(filtered));
    },
};

// 사용자 설정 관리
export const settingsStorage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
            const parsed = settings ? JSON.parse(settings) : {};
            return parsed[key] !== undefined ? parsed[key] : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: (key: string, value: any): void => {
        try {
            const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
            const parsed = settings ? JSON.parse(settings) : {};
            parsed[key] = value;
            localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(parsed));
        } catch (error) {
            console.error('Failed to save setting:', error);
        }
    },
};

// 거리 계산 함수 (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 초기 데이터 설정
export const initializeStorage = async () => {  // async 추가!
    // 기존 데이터가 없으면 Mock 데이터로 초기화
    const existingReports = reportsStorage.getAll();
    if (existingReports.length === 0) {
        const { generateMockReports } = await import('./mockData');
        const mockReports = generateMockReports(15);
        reportsStorage.save(mockReports);
        console.log('Initialized with mock data:', mockReports.length, 'reports');
    }
};