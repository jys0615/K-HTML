import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        path: '/',
        label: '홈',
        icon: Home,
        description: '메인 화면'
    },
    {
        path: '/report',
        label: '제보',
        icon: AlertTriangle,
        description: '교통 상황 제보'
    },
    {
        path: '/map',
        label: '지도',
        icon: Map,
        description: '제보 지도 보기'
    },
];

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="bg-white border-t border-gray-200 px-2 py-1 safe-area-bottom">
            <div className="flex justify-around max-w-md mx-auto">
                {navItems.map(({ path, label, icon: Icon, description }) => {
                    const isActive = location.pathname === path ||
                        (path === '/report' && location.pathname.startsWith('/report'));

                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={cn(
                                "flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                                isActive
                                    ? "text-blue-600 bg-blue-50 scale-105"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95"
                            )}
                            aria-label={description}
                        >
                            <Icon className={cn(
                                "w-5 h-5 mb-1 transition-transform",
                                isActive && "scale-110"
                            )} />
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                isActive && "font-semibold"
                            )}>
                                {label}
                            </span>

                            {/* 활성 표시 점 */}
                            {isActive && (
                                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};