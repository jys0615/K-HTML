# 동문서답 프론트엔드 - Phase 1

> 교통 정체 제보 및 민원 작성 서비스의 사용자 앱 (Phase 1: 제보 시스템)

## 📋 프로젝트 개요

**동문서답**은 시민들이 교통 정체 상황을 실시간으로 제보하고, AI의 도움을 받아 관련 민원을 작성할 수 있는 서비스입니다.

### Phase 1 완성 기능
- ✅ **위치 기반 교통 제보**: GPS를 활용한 실시간 위치 기반 제보
- ✅ **3가지 제보 방식**: 운전자/대중교통/사후 제보 지원
- ✅ **네이버 지도 연동**: 제보 위치를 지도에 시각적으로 표시
- ✅ **로컬 데이터 저장**: 백엔드 없이 로컬 스토리지 기반 데이터 관리
- ✅ **반응형 UI**: 모바일 우선 설계의 사용자 친화적 인터페이스

## 🚀 기술 스택

### Core
- **React 18** + **TypeScript** + **Vite**
- **React Router v6** - 클라이언트 사이드 라우팅
- **TailwindCSS** - 유틸리티 기반 스타일링

### UI/UX
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **Radix UI** - 접근성을 고려한 헤드리스 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### 상태 관리
- **Zustand** - 경량 상태 관리 (UI/지도/제보 상태)
- **TanStack Query** - 서버 상태 관리 (향후 백엔드 연동용)

### 폼 관리
- **React Hook Form** - 폼 상태 및 검증
- **Zod** - 스키마 기반 검증

### 지도 & 위치
- **Naver Maps API** - 지도 표시 및 마커 관리
- **Web Geolocation API** - 사용자 위치 추적

### 데이터 관리
- **Local Storage** - 클라이언트 사이드 데이터 저장
- **Mock Data** - 실제 서비스와 동일한 사용자 경험 제공

## 📁 프로젝트 구조

```
src/
├── components/                 # UI 컴포넌트
│   ├── ui/                    # shadcn/ui 기본 컴포넌트
│   ├── common/                # 공통 컴포넌트
│   │   ├── Layout/            # 레이아웃 관련 (Header, BottomNav, AppLayout)
│   │   ├── Map/               # 지도 관련 컴포넌트
│   │   ├── Loading/           # 로딩 상태 컴포넌트
│   │   └── Toast/             # 알림 컴포넌트
│   └── features/              # 기능별 컴포넌트
│       ├── home/              # 홈 화면 관련
│       └── report/            # 제보 관련
├── pages/                     # 페이지 컴포넌트
│   ├── HomePage.tsx           # M-10: 메인 홈 화면
│   ├── ReportSelectPage.tsx   # M-20: 제보 방식 선택
│   ├── DriverReportPage.tsx   # M-21: 운전자 제보
│   ├── TransitReportPage.tsx  # M-22: 대중교통 제보
│   ├── PostReportPage.tsx     # M-30: 사후 제보
│   └── ReportMapPage.tsx      # M-50: 제보 지도
├── hooks/                     # 커스텀 훅
│   ├── useGeolocation.ts      # 위치 정보 관리
│   ├── useNaverMap.ts         # 네이버 지도 제어
│   └── api/                   # API 관련 훅 (향후 백엔드 연동용)
├── stores/                    # Zustand 상태 관리
│   ├── uiStore.ts             # UI 상태 (로딩, 토스트, 모달)
│   ├── mapStore.ts            # 지도 상태 (중심점, 줌, 마커)
│   └── reportStore.ts         # 제보 상태 (CRUD, 초안 관리)
├── services/                  # 외부 서비스 연동
│   ├── data/                  # 데이터 관리
│   │   ├── localStorage.ts    # 로컬 스토리지 관리
│   │   └── mockData.ts        # Mock 데이터 생성
│   └── map/                   # 지도 관련 서비스
├── types/                     # TypeScript 타입 정의
│   ├── common.ts              # 공통 타입 (Location, LatLng)
│   ├── api.ts                 # API 관련 타입 (Report, Alert)
│   └── map.ts                 # 지도 관련 타입
├── utils/                     # 유틸리티 함수
│   └── constants.ts           # 상수 정의
└── lib/                       # 외부 라이브러리 설정
    └── utils.ts               # shadcn/ui 유틸리티
```

## 🎯 핵심 기능 설명

### 1. 제보 시스템 (Report System)
사용자가 교통 상황을 쉽게 제보할 수 있는 시스템

**주요 컴포넌트:**
- `ReportSelectPage`: 제보 방식 선택 (운전자/대중교통/사후)
- `DriverReportPage`: 운전 중 간편 제보
- `TransitReportPage`: 대중교통 이용 시 제보 (노선 정보 포함)
- `PostReportPage`: 과거 상황에 대한 사후 제보

**데이터 플로우:**
```
사용자 입력 → 폼 검증 → AI 문장 보정 → 로컬 저장 → 지도 표시
```

### 2. 지도 시스템 (Map System)
네이버 지도를 활용한 위치 기반 시각화

**주요 기능:**
- 실시간 위치 추적 및 표시
- 제보 마커 표시 및 클러스터링
- 지도 상호작용 (줌, 드래그, 마커 클릭)
- 위치 기반 주소 변환 (역지오코딩)

### 3. 상태 관리 시스템
Zustand를 활용한 효율적인 상태 관리

**스토어 구조:**
- **UI Store**: 전역 UI 상태 (로딩, 알림, 모달)
- **Map Store**: 지도 관련 상태 (중심점, 줌, 마커, 필터)
- **Report Store**: 제보 관련 상태 (목록, CRUD, 초안)

## 🚀 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 네이버 지도 API 키 설정
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🔧 주요 설정 파일

### 환경 변수 (.env)
```env
VITE_NAVER_MAP_CLIENT_ID=your_naver_map_client_id_here
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_VERSION=1.0.0
VITE_MOCK_DELAY=1000
```

### 네이버 지도 API 설정
1. [네이버 클라우드 플랫폼](https://www.ncloud.com/) 가입
2. Application Service > Maps > Web Dynamic Map에서 API 키 발급
3. `.env` 파일에 API 키 설정
4. `index.html`에 스크립트 태그 추가

## 📱 사용자 플로우

### 제보 작성 플로우
1. **홈 화면** → 제보하기 버튼 클릭
2. **제보 방식 선택** → 운전자/대중교통/사후 중 선택
3. **제보 폼 작성** → 위치, 정체 수준, 상황 설명 입력
4. **AI 문장 보정** → 입력한 내용을 자연스러운 문장으로 개선
5. **제보 완료** → 지도에 마커 표시 및 완료 알림

### 지도 탐색 플로우
1. **지도 화면** → 현재 위치 및 주변 제보 표시
2. **마커 클릭** → 제보 상세 정보 확인
3. **필터링** → 제보 유형, 정체 수준별 필터링
4. **위치 이동** → 특정 지역으로 지도 이동

## 🔄 데이터 관리

### 로컬 스토리지 구조
```typescript
// 제보 데이터
dongmunseodap_reports: Report[]

// 사용자 제보 ID 목록  
dongmunseodap_user_reports: string[]

// 사용자 설정
dongmunseodap_settings: UserSettings
```

### Mock 데이터
- **실제 서비스와 동일한 UX** 제공
- **서울 주요 지점 기반** 샘플 데이터
- **랜덤 생성 로직**으로 다양한 시나리오 테스트 가능

## 🎨 UI/UX 특징

### 모바일 퍼스트 디자인
- **반응형 레이아웃**: 모든 화면 크기에 최적화
- **터치 친화적**: 충분한 터치 영역과 제스처 지원
- **직관적 네비게이션**: 하단 탭 바 기반 네비게이션

### 접근성 고려
- **시맨틱 HTML**: 스크린 리더 친화적 구조
- **키보드 네비게이션**: 모든 기능을 키보드로 조작 가능
- **색상 대비**: WCAG 가이드라인 준수

## 🧪 테스트

### 기능 테스트 체크리스트
- [ ] 위치 권한 허용/거부 시나리오
- [ ] 3가지 제보 방식 모두 정상 작동
- [ ] 지도 마커 클릭 시 상세 정보 표시
- [ ] 제보 후 토스트 알림 및 지도 업데이트
- [ ] 네트워크 오프라인 상황에서도 기본 기능 작동

### 크로스 브라우저 테스트
- ✅ Chrome (권장)
- ✅ Safari (iOS)
- ✅ Samsung Internet
- ⚠️ Firefox (일부 지도 기능 제한)

## 🚧 알려진 제한사항

### Phase 1 한계
- **백엔드 미연동**: 로컬 스토리지 기반 데이터 저장
- **실시간 알림 없음**: 푸시 알림 기능 미구현
- **AI 기능 시뮬레이션**: 실제 AI 서버 연동 없음
- **사용자 인증 없음**: 단일 사용자 기준 구현

### 기술적 제약
- **네이버 지도 의존성**: 네이버 지도 API 필수
- **위치 권한 필요**: GPS 기능 사용을 위한 권한 필수
- **모던 브라우저 필요**: ES2020+ 문법 사용

## 🔮 다음 단계 (Phase 2)

### 추가 예정 기능
- **AI 민원 작성**: 제보 기반 자동 민원 초안 생성
- **챗봇 인터페이스**: 대화형 민원 작성 도우미
- **민원 관리**: 작성한 민원 조회 및 상태 추적
- **공감 시스템**: 다른 사용자 민원에 공감 표시

### 기술적 개선
- **백엔드 API 연동**: 실제 서버와 데이터 동기화
- **PWA 기능**: 오프라인 지원 및 앱 설치
- **성능 최적화**: 코드 스플리팅 및 지연 로딩

## 👥 기여하기

### 개발 환경 설정
1. 이 레포지토리를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 코딩 규칙
- **TypeScript 엄격 모드** 사용
- **ESLint + Prettier** 규칙 준수
- **컴포넌트명은 PascalCase** 사용
- **파일명은 camelCase** 사용
- **명확한 커밋 메시지** 작성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Made with ❤️ for better traffic reporting**