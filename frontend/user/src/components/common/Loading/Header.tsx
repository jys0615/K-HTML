import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Menu } from 'lucide-react';

export const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return '동문서답';
            case '/report': return '제보 방식 선택';
            case '/report/driver': return '운전자 제보';
            case '/report/transit': return '대중교통 제보';
            case '/report/post': return '사후 제보';
            case '/map': return '제보 지도';
            default: return '동문서답';
        }
    };

    const canGoBack = location.pathname !== '/';
    const showMenu = location.pathname === '/';

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between min-h-[56px]">
            <div className="flex items-center gap-3">
                {canGoBack ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="p-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                )}

                <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {getTitle()}
                </h1>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => {
                    // 설정 페이지로 이동 (나중에 구현)
                    console.log('설정 클릭');
                }}
            >
                <Settings className="w-5 h-5" />
            </Button>
        </header>
    );
};