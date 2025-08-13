import { create } from 'zustand';
import type { Location } from '@/types/common';

interface UIState {
    // 로딩 상태
    isLoading: boolean;
    loadingMessage: string;

    // 위치 정보
    currentLocation: Location | null;
    isLocationLoading: boolean;
    locationError: string | null;

    // UI 상태
    activeSheet: string | null;
    showSafetyModal: boolean;

    // 알림/토스트
    toastMessage: string | null;

    // Actions
    setLoading: (loading: boolean, message?: string) => void;
    setCurrentLocation: (location: Location | null) => void;
    setLocationLoading: (loading: boolean) => void;
    setLocationError: (error: string | null) => void;
    setActiveSheet: (sheet: string | null) => void;
    setSafetyModal: (show: boolean) => void;
    showToast: (message: string) => void;
    hideToast: () => void;
    reset: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Initial state
    isLoading: false,
    loadingMessage: '',
    currentLocation: null,
    isLocationLoading: false,
    locationError: null,
    activeSheet: null,
    showSafetyModal: false,
    toastMessage: null,

    // Actions
    setLoading: (loading, message = '') =>
        set({ isLoading: loading, loadingMessage: message }),

    setCurrentLocation: (location) =>
        set({ currentLocation: location, locationError: null }),

    setLocationLoading: (loading) =>
        set({ isLocationLoading: loading }),

    setLocationError: (error) =>
        set({ locationError: error, isLocationLoading: false }),

    setActiveSheet: (sheet) =>
        set({ activeSheet: sheet }),

    setSafetyModal: (show) =>
        set({ showSafetyModal: show }),

    showToast: (message) => {
        set({ toastMessage: message });
        // 3초 후 자동 제거
        setTimeout(() => {
            if (get().toastMessage === message) {
                set({ toastMessage: null });
            }
        }, 3000);
    },

    hideToast: () =>
        set({ toastMessage: null }),

    reset: () =>
        set({
            isLoading: false,
            loadingMessage: '',
            activeSheet: null,
            showSafetyModal: false,
            toastMessage: null,
        }),
}));