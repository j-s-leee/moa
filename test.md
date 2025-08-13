# 저축 계획 관리 서비스 기획서

## 📋 서비스 개요

### 핵심 가치 제안

- **단순함**: 월 단위 고정 수입/지출 + 연간 비정기 지출 예산으로 복잡도 최소화
- **명확성**: 목표 금액 달성까지의 정확한 기간 계산
- **투명성**: 실제 지출 vs 예산 비교를 통한 저축 성과 추적
- **동기부여**: 절약을 통한 목표 달성 기간 단축 효과 시각화

### 타겟 사용자

- 체계적인 저축을 원하는 20-40대
- 명확한 재정 목표(결혼, 집구입, 여행 등)가 있는 사람
- 가계부는 복잡하지만 저축 계획은 세우고 싶은 사람

## 🎯 핵심 기능

### 1. 기본 재정 정보 설정

**월 수입 관리**

- 주급여, 부수입 등 월 고정 수입 항목별 관리
- 수입 변동 시 새로운 기간부터 적용

**월 고정지출 관리**

- 주거비, 통신비, 보험료, 대출 등 매월 고정 지출
- 지출 변동 시 새로운 기간부터 적용

### 2. 연간 비정기지출 예산 관리

**카테고리별 예산 설정**

- 여행, 운동, 문화생활, 경조사비, 의료비, 쇼핑 등
- 연간 총 예산 금액 설정
- 예산 수정 시 남은 기간에 대해서만 적용

**실제 지출 기록**

- 카테고리별 실제 사용 금액 입력
- 월별/연간 예산 대비 사용률 추적
- 남은 예산 또는 초과 금액 실시간 표시

### 3. 저축 목표 및 계획

**목표 설정**

- 목표 금액 설정
- 목표 달성 희망 기간 (선택사항)

**자동 계산**

- 월 저축 가능 금액 = 월 수입 - 월 고정지출 - (연간 비정기지출 예산 ÷ 12)
- 목표 달성 예상 기간 계산
- 절약 효과 시뮬레이션

### 4. 진행 상황 추적

**대시보드**

- 현재 저축 진행률
- 이번 달 예산 사용 현황
- 목표 달성까지 남은 기간

**상세 분석**

- 월별 저축 실적
- 비정기지출 카테고리별 분석
- 절약/초과 지출 트렌드

## 🏗️ 기술 아키텍처

### Frontend Stack

```
React Router (Framework Mode)
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
├── Zustand (상태관리)
├── React Hook Form + Zod (폼 관리)
├── Recharts (차트)
└── date-fns (날짜 처리)
```

### Backend & Database

```
Supabase
├── PostgreSQL (데이터베이스)
├── Row Level Security (보안)
├── Realtime (실시간 업데이트)
└── Auth (인증)
```

### 데이터베이스 스키마

```sql
-- 사용자 프로필
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  savings_goal DECIMAL(10,2),
  goal_deadline DATE
);

-- 월 수입 항목
CREATE TABLE monthly_incomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 월 고정지출 항목
CREATE TABLE monthly_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 비정기지출 카테고리
CREATE TABLE irregular_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  annual_budget DECIMAL(10,2) NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name, year)
);

-- 비정기지출 실제 사용 내역
CREATE TABLE irregular_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  category_id UUID REFERENCES irregular_categories(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 저축 기록
CREATE TABLE savings_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📱 UI/UX 설계

### 네비게이션 구조

```
📱 메인 대시보드
├── 💰 수입/지출 관리
│   ├── 월 수입 설정
│   ├── 월 고정지출 설정
│   └── 비정기지출 예산 관리
├── 🎯 목표 설정
├── 📊 현황 분석
└── ⚙️ 설정
```

### 주요 화면 구성

#### 1. 메인 대시보드

- **저축 진행률** (원형 차트)
- **이번 달 예산 현황** (막대 차트)
- **목표 달성까지** (D-day 표시)
- **빠른 지출 기록** (FAB 버튼)

#### 2. 수입/지출 관리

- **월 수입** (+ 추가 버튼)
- **월 고정지출** (+ 추가 버튼)
- **비정기지출 예산** (카테고리별 카드)
- **월 저축 가능액** (하이라이트)

#### 3. 목표 설정

- **목표 금액 입력**
- **현재 저축액 입력**
- **목표 달성 예상 기간** (자동 계산)
- **절약 시뮬레이터**

#### 4. 현황 분석

- **월별 저축 실적** (라인 차트)
- **비정기지출 분석** (도넛 차트)
- **예산 vs 실제** (비교 차트)

## 🔄 사용자 플로우

### 초기 설정 플로우

1. **회원가입/로그인**
2. **월 수입 입력** (여러 항목 가능)
3. **월 고정지출 입력** (여러 항목 가능)
4. **비정기지출 카테고리 및 예산 설정**
5. **저축 목표 설정**
6. **대시보드로 이동**

### 일상 사용 플로우

1. **대시보드 확인**
2. **비정기지출 발생 시 기록**
3. **월말 저축 실적 확인**
4. **필요시 예산 조정**

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary**: 저축/성장을 상징하는 그린 계열
- **Secondary**: 신뢰감을 주는 블루 계열
- **Warning**: 예산 초과 시 주의를 주는 오렌지
- **Error**: 중요한 알림을 위한 레드
- **Success**: 목표 달성을 위한 그린

### 타이포그래피

- **헤딩**: 명확하고 강한 인상의 폰트
- **바디**: 가독성이 좋은 시스템 폰트
- **숫자**: 모노스페이스 폰트로 정렬감 확보

### 컴포넌트 가이드라인

- **카드**: 정보 그룹핑을 위한 기본 컨테이너
- **버튼**: 명확한 액션 구분을 위한 계층적 스타일
- **입력**: 사용자 친화적인 폼 요소
- **차트**: 데이터 시각화를 위한 일관된 스타일

## 🚀 개발 단계

### Phase 1: MVP (4주)

- 기본 CRUD 기능
- 단순 계산 로직
- 핵심 화면 구현

### Phase 2: 고도화 (3주)

- 차트 및 분석 기능
- 복잡한 계산 로직
- 사용자 경험 개선

### Phase 3: 최적화 (2주)

- 성능 최적화
- 에러 처리 강화
- 모바일 최적화

## 📊 성공 지표

### 사용자 행동 지표

- **일일 활성 사용자 (DAU)**
- **월 저축 목표 달성률**
- **비정기지출 기록 빈도**

### 비즈니스 지표

- **사용자 리텐션율**
- **목표 달성 완료율**
- **평균 사용 기간**

---

이 기획서를 바탕으로 실제 프로덕션 레벨의 서비스를 구현할 수 있습니다. 각 단계별로 상세한 구현 방안을 제시해드릴 수 있으니, 어떤 부분부터 시작하고 싶으신지 알려주세요!
