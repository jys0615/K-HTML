# frontend

버전, 혹은 OS 문제로 작동이 안되실 수는 있습니다!

# 1. npm으로 Vite 프로젝트 생성(초기에 디렉토리 생성 당시 명령어입니다. 아마 안 하셔도 될 거에요)
npm create vite@latest . -- --template react-ts

# 설치 순서

npm install
# sonner 설치 (toast 대신)
npx shadcn@latest add sonner

# 다른 컴포넌트들도 설치
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add sheet
npx shadcn@latest add dialog

# React Router
npm install react-router-dom

# 상태 관리  
npm install zustand @tanstack/react-query

# HTTP 클라이언트
npm install axios

# 폼 관리
npm install react-hook-form @hookform/resolvers zod

# 유틸리티
npm install date-fns lucide-react

# TypeScript 타입 설치
npm install -D @types/node

# 필수 패키지 한 번에 설치
npm install react-router-dom zustand @tanstack/react-query axios react-hook-form @hookform/resolvers zod date-fns lucide-react