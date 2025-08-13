// 지도 관련 상수
export const MAP_CONFIG = {
    DEFAULT_CENTER: { lat: 37.5665, lng: 126.9780 }, // 서울시청
    DEFAULT_ZOOM: 15,
    MIN_ZOOM: 10,
    MAX_ZOOM: 19,
    MARKER_CLUSTER_DISTANCE: 50, // 픽셀
} as const;

// 위치 관련 상수
export const LOCATION_CONFIG = {
    HIGH_ACCURACY_TIMEOUT: 15000, // 15초
    LOW_ACCURACY_TIMEOUT: 30000,  // 30초
    MAXIMUM_AGE: 300000,           // 5분
    MIN_DISTANCE_CHANGE: 10,       // 10미터
} as const;

// 제보 관련 상수
export const REPORT_CONFIG = {
    MAX_DESCRIPTION_LENGTH: 200,
    MIN_DESCRIPTION_LENGTH: 5,
    TRAFFIC_LEVELS: [
        { value: 1, label: '원활', color: 'green' },
        { value: 2, label: '서행', color: 'yellow' },
        { value: 3, label: '지체', color: 'orange' },
        { value: 4, label: '정체', color: 'red' },
        { value: 5, label: '극심', color: 'purple' },
    ],
    REPORT_TYPES: [
        { value: 'driver', label: '운전자 제보', icon: '🚗' },
        { value: 'transit', label: '대중교통 제보', icon: '🚌' },
        { value: 'post', label: '사후 제보', icon: '📍' },
    ],
} as const;

// API 관련 상수
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
    MOCK_DELAY: Number(import.meta.env.VITE_MOCK_DELAY) || 1000,
} as const;

// 앱 관련 상수
export const APP_CONFIG = {
    NAME: '동문서답',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    NAVER_MAP_CLIENT_ID: import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
} as const;