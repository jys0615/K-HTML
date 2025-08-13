import { create } from 'zustand';
import type { Report, CreateReportRequest } from '@/types/api';
import { reportsStorage, userReportsStorage } from '@/services/data/localStorage';

interface ReportState {
    // 제보 데이터
    allReports: Report[];
    userReports: Report[];

    // 현재 작성 중인 제보
    currentDraft: Partial<CreateReportRequest> | null;

    // 상태
    isLoading: boolean;
    error: string | null;
    lastSubmittedReport: Report | null;

    // Actions
    loadReports: () => Promise<void>;
    loadUserReports: () => Promise<void>;
    createReport: (reportData: CreateReportRequest) => Promise<Report>;
    deleteReport: (reportId: string) => Promise<boolean>;

    // Draft management
    setDraft: (draft: Partial<CreateReportRequest>) => void;
    updateDraft: (updates: Partial<CreateReportRequest>) => void;
    clearDraft: () => void;

    // Utilities
    getReportById: (id: string) => Report | null;
    getReportsByLocation: (location: { lat: number; lng: number }, radiusKm?: number) => Report[];
    clearError: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
    // Initial state
    allReports: [],
    userReports: [],
    currentDraft: null,
    isLoading: false,
    error: null,
    lastSubmittedReport: null,

    // Load all reports
    loadReports: async () => {
        set({ isLoading: true, error: null });
        try {
            // 시뮬레이션 지연
            await new Promise(resolve => setTimeout(resolve, 500));

            const reports = reportsStorage.getAll();
            set({ allReports: reports, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load reports',
                isLoading: false
            });
        }
    },

    // Load user's reports
    loadUserReports: async () => {
        set({ isLoading: true, error: null });
        try {
            const userReportIds = userReportsStorage.getAll();
            const allReports = reportsStorage.getAll();
            const userReports = allReports.filter(report =>
                userReportIds.includes(report.id)
            );

            set({ userReports, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load user reports',
                isLoading: false
            });
        }
    },

    // Create new report
    createReport: async (reportData) => {
        set({ isLoading: true, error: null });
        try {
            // 시뮬레이션 지연 (AI 처리 시간)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // AI 문장 보정 시뮬레이션
            const enhancedDescription = enhanceDescription(reportData.description, reportData.type);
            const enhancedReportData = {
                ...reportData,
                description: enhancedDescription,
            };

            const newReport = reportsStorage.add(enhancedReportData);

            // 상태 업데이트
            const { allReports, userReports } = get();
            set({
                allReports: [newReport, ...allReports],
                userReports: [newReport, ...userReports],
                lastSubmittedReport: newReport,
                currentDraft: null,
                isLoading: false,
            });

            return newReport;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create report',
                isLoading: false
            });
            throw error;
        }
    },

    // Delete report
    deleteReport: async (reportId) => {
        set({ isLoading: true, error: null });
        try {
            const success = reportsStorage.remove(reportId);

            if (success) {
                const { allReports, userReports } = get();
                set({
                    allReports: allReports.filter(r => r.id !== reportId),
                    userReports: userReports.filter(r => r.id !== reportId),
                    isLoading: false,
                });
            }

            return success;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete report',
                isLoading: false
            });
            return false;
        }
    },

    // Draft management
    setDraft: (draft) => set({ currentDraft: draft }),

    updateDraft: (updates) => {
        const { currentDraft } = get();
        set({
            currentDraft: currentDraft ? { ...currentDraft, ...updates } : updates
        });
    },

    clearDraft: () => set({ currentDraft: null }),

    // Utilities
    getReportById: (id) => {
        const { allReports } = get();
        return allReports.find(report => report.id === id) || null;
    },

    getReportsByLocation: (location, radiusKm = 5) => {
        const { allReports } = get();
        return reportsStorage.getByLocation(location, radiusKm);
    },

    clearError: () => set({ error: null }),
}));

// AI 문장 보정 시뮬레이션
function enhanceDescription(description: string, type: Report['type']): string {
    if (!description.trim()) {
        return getDefaultDescription(type);
    }

    // 간단한 문장 보정 규칙
    let enhanced = description.trim();

    // 첫 글자 대문자화
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

    // 마침표 추가
    if (!enhanced.endsWith('.') && !enhanced.endsWith('!') && !enhanced.endsWith('?')) {
        enhanced += '.';
    }

    // 타입별 접미사 추가
    const suffixes = {
        driver: ' (운전자 제보)',
        transit: ' (대중교통 제보)',
        post: ' (사후 제보)',
    };

    return enhanced + suffixes[type];
}

function getDefaultDescription(type: Report['type']): string {
    const defaults = {
        driver: '교통 정체가 발생했습니다. (운전자 제보)',
        transit: '대중교통 이용에 지연이 있습니다. (대중교통 제보)',
        post: '해당 시간에 교통 상황이 좋지 않았습니다. (사후 제보)',
    };

    return defaults[type];
}