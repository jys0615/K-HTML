import React from 'react';
import { Header } from '../Loading/Header';
import { BottomNav } from './BottomNav';
import { Toast } from '../Toast/Toast';
import { LoadingOverlay } from '../Loading/LoadingOverlay';
import { useUIStore } from '@/stores/uiStore';

interface AppLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showBottomNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    showHeader = true,
    showBottomNav = true,
}) => {
    const { isLoading, toastMessage } = useUIStore();

    return (
        <div className="flex flex-col h-screen bg-gray-50 relative">
            {showHeader && <Header />}

            {/* 👇 여기가 핵심 수정 부분입니다  */}
            <main className="flex-1 overflow-y-auto min-h-0 relative">
                {children}
            </main>

            {showBottomNav && <BottomNav />}

            {/* 전역 컴포넌트들 */}
            {isLoading && <LoadingOverlay />}
            {toastMessage && <Toast message={toastMessage} />}
        </div>
    );
};