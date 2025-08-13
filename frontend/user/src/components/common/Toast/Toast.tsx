import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300); // 애니메이션 완료 후 제거
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <Check className="w-5 h-5" />;
            case 'error': return <X className="w-5 h-5" />;
            case 'warning': return <AlertCircle className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        const baseStyles = "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border";

        switch (type) {
            case 'success':
                return cn(baseStyles, "bg-green-50 border-green-200 text-green-800");
            case 'error':
                return cn(baseStyles, "bg-red-50 border-red-200 text-red-800");
            case 'warning':
                return cn(baseStyles, "bg-yellow-50 border-yellow-200 text-yellow-800");
            default:
                return cn(baseStyles, "bg-blue-50 border-blue-200 text-blue-800");
        }
    };

    return (
        <div className={cn(
            "fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm transition-all duration-300",
            isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
        )}>
            <div className={getStyles()}>
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <p className="flex-1 text-sm font-medium">
                    {message}
                </p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose?.(), 300);
                    }}
                    className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};