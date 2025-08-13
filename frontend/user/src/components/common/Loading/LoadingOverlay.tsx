import React from 'react';
import { Loader2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export const LoadingOverlay: React.FC = () => {
    const { loadingMessage } = useUIStore();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 min-w-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <div className="text-center">
                    <p className="text-gray-900 font-medium">
                        {loadingMessage || '처리 중...'}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        잠시만 기다려주세요
                    </p>
                </div>
            </div>
        </div>
    );
};