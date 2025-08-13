import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/common/Layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { ReportSelectPage } from '@/pages/ReportSelectPage';
import { DriverReportPage } from '@/pages/DriverReportPage';
import { TransitReportPage } from '@/pages/TransitReportPage';
import { PostReportPage } from '@/pages/PostReportPage';
import { ReportMapPage } from '@/pages/ReportMapPage';
import { initializeStorage } from '@/services/data/localStorage';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  useEffect(() => {
    const init = async () => {
      await initializeStorage();
    };
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportSelectPage />} />
            <Route path="/report/driver" element={<DriverReportPage />} />
            <Route path="/report/transit" element={<TransitReportPage />} />  {/* 이 라우트 추가! */}
            <Route path="/report/post" element={<PostReportPage />} />
            <Route path="/map" element={<ReportMapPage />} />
            <Route path="*" element={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h1>
                  <p className="text-gray-600 mb-4">요청하신 페이지가 존재하지 않습니다.</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    홈으로 돌아가기
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;