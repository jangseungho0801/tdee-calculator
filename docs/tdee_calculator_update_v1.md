# TDEE 계산기 웹서비스 업데이트 구현 요청서 v1

## 0. 문서 목적
이 문서는 기존 배포된 TDEE 계산기 웹서비스를 업데이트하기 위해, 코덱스 CLI에 바로 전달 가능한 수준으로 구현 범위와 구조를 정의한 문서이다.

이 문서는 설명용이 아니라 실제 구현 요청용 문서다.
추상적인 표현은 사용하지 않고, 페이지/컴포넌트/상태/로직/라우팅 기준으로 작성한다.

---

## 1. 프로젝트 목표
기존 TDEE 계산기 웹서비스를 아래 구조로 업데이트한다.

### 목표 기능
- 사용자의 다이어트/유지/벌크업 목적에 맞는 일일 섭취 칼로리 계산
- TDEE 계산
- 목적별 일일 권장 칼로리 제공
- 목적별 탄수화물/단백질/지방 비율 및 g 수 제공

### 이번 버전의 핵심 구조
- 인트로 페이지 추가
- 입력 페이지와 결과 페이지 분리
- 결과 페이지는 감량 / 유지 / 벌크업 탭 구조 적용
- 체지방률 선택 입력 추가
- 체지방률 입력 여부에 따라 TDEE 계산 공식 자동 분기
- 결과 페이지 하단에 다시 계산하기 버튼 추가

---

## 2. 반드시 지켜야 할 구현 원칙

### 2-1. 페이지 역할 분리
- 인트로 페이지: 서비스 소개 + CTA
- 입력 페이지: 사용자 입력 + 계산 실행
- 결과 페이지: 계산 결과 표시 전용

### 2-2. 계산 실행 위치
- 계산은 반드시 입력 페이지에서 실행한다.
- 결과 페이지에서는 계산을 다시 하지 않는다.
- 결과 페이지는 Context에 저장된 계산 결과를 표시만 한다.

### 2-3. 상태 관리 방식
- React Context API 사용
- 입력값과 계산 결과를 전역 상태로 관리
- 페이지 이동 시 Context를 통해 결과 페이지에서 값을 읽는다.

### 2-4. 계산 로직 분리
- 계산 로직은 UI 컴포넌트 내부에 직접 작성하지 않는다.
- 계산 로직은 기능별 유틸 파일로 분리한다.

---

## 3. 페이지 구성

## 3-1. 인트로 페이지
### 경로
- `/`

### 목적
- 사용자를 입력 페이지로 이동시키는 역할

### 포함 요소
- 메인 헤드라인
- 서브 설명 문구
- 핵심 포인트 2~3개
- CTA 버튼 1개

### 동작
- CTA 버튼 클릭 시 `/input`으로 이동

### 주의
- 인트로 페이지에는 결과 미리보기 UI를 넣지 않는다.
- 인트로 페이지는 후킹 중심 구조로 만든다.

---

## 3-2. 입력 페이지
### 경로
- `/input`

### 목적
- 사용자 입력값 수집
- 입력값 검증
- 계산 실행
- 결과 상태 저장
- 결과 페이지 이동

### 레이아웃 방식
- 한 화면에 모든 입력 필드 노출
- 섹션 구분형 레이아웃 사용
- 각 섹션은 카드 스타일 UI로 구성

### 섹션 구성

#### 섹션 1. 기본 정보
- 성별
- 나이

#### 섹션 2. 신체 정보
- 키
- 몸무게

#### 섹션 3. 활동량
- 활동량

#### 섹션 4. 추가 정보
- 체지방률 (선택)

### 입력 순서
1. 성별
2. 나이
3. 키
4. 몸무게
5. 활동량
6. 체지방률

### 입력 방식
- 성별: 라디오 버튼
- 나이: 숫자 입력
- 키: 숫자 입력
- 몸무게: 숫자 입력
- 활동량: 라디오 버튼 + 설명
- 체지방률: 숫자 입력 (선택)

### CTA
- 계산하기 버튼

### 계산 버튼 클릭 시 처리 순서
1. 필수 입력값 검증
2. 입력값 객체 생성
3. 체지방률 입력 여부 확인
4. BMR 계산
5. TDEE 계산
6. 목표별 칼로리 계산
7. 목표별 탄단지 계산
8. 결과를 Context에 저장
9. `/result`로 이동

---

## 3-3. 결과 페이지
### 경로
- `/result`

### 목적
- 입력 페이지에서 계산된 결과를 표시
- 다시 계산 또는 추후 상세 페이지 이동 유도

### 상단 표시 항목
- TDEE 값

### 본문 구조
- 탭 UI 사용
- 탭 목록:
  - 감량
  - 유지
  - 벌크업

### 탭 선택 시 표시 항목
- 하루 권장 칼로리 (kcal)
- 탄수화물 비율 (%)
- 탄수화물 g
- 단백질 비율 (%)
- 단백질 g
- 지방 비율 (%)
- 지방 g

### 하단 버튼
- 다시 계산하기 버튼

### 다시 계산하기 버튼 동작
- 클릭 시 `/input`으로 이동

### 추후 확장 고려
결과 페이지 하단에 아래 버튼이 추가될 수 있도록 구조를 열어둘 것.
- 다이어트 가이드 보기
- 벌크업 가이드 보기

단, 이번 버전에서는 실제 페이지를 구현하지 않아도 된다.
라우팅 확장 가능성을 고려한 컴포넌트 구조만 유지하면 된다.

---

## 4. 지원 범위

### 지원 목적
- 감량
- 유지
- 벌크업

### 지원 입력값
- 성별
- 나이
- 키
- 몸무게
- 활동량
- 체지방률(선택)

### 이번 버전에서 제외
- 회원가입/로그인
- 계산 결과 저장
- 공유 기능
- 식단 추천
- 음식 추천
- 운동 추천
- 가이드 상세 페이지 구현
- 서버 API 연동

---

## 5. 계산 규칙

## 5-1. 공식 분기 규칙
### 체지방률 입력값이 있는 경우
- Katch-McArdle 공식 사용

### 체지방률 입력값이 없는 경우
- Mifflin-St Jeor 공식 사용

---

## 5-2. 계산 단계
1. BMR 계산
2. 활동량 계수 반영하여 TDEE 계산
3. 목표별 일일 권장 칼로리 계산
   - 감량
   - 유지
   - 벌크업
4. 목표별 탄단지 비율 계산
5. 탄단지 g 환산

---

## 5-3. 구현 원칙
- 계산 로직은 UI 파일에 직접 작성하지 않는다.
- 각 계산 단계는 함수 단위로 분리한다.
- 결과 타입을 일관되게 유지한다.

---

## 6. 상태 관리 설계

## 6-1. Context에 저장할 데이터
아래 2개 그룹을 저장한다.

### inputData
사용자 입력값
- gender
- age
- height
- weight
- activityLevel
- bodyFatPercentage

### resultData
계산 결과값
- bmr
- tdee
- goals
  - cut
  - maintain
  - bulk
- macros
  - cut
  - maintain
  - bulk

---

## 6-2. 상태 흐름
1. 입력 페이지에서 사용자가 값 입력
2. 계산하기 버튼 클릭
3. 계산 실행
4. inputData + resultData를 Context에 저장
5. 결과 페이지에서 Context 값 조회 후 렌더링

---

## 6-3. 예외 처리
- 결과 페이지 직접 진입 시 Context에 결과가 없으면 `/input`으로 리다이렉트

---

## 7. 파일 구조
기능 기준 구조로 생성한다.

```text
src/
  app/
    providers/
      AppProviders.tsx
    router/
      AppRouter.tsx

  pages/
    IntroPage.tsx
    InputPage.tsx
    ResultPage.tsx

  components/
    intro/
      IntroHero.tsx
      IntroHighlights.tsx
      StartButton.tsx

    input/
      InputForm.tsx
      BasicInfoSection.tsx
      BodyInfoSection.tsx
      ActivityLevelSection.tsx
      AdditionalInfoSection.tsx
      CalculateButton.tsx

    result/
      ResultHeader.tsx
      GoalTabs.tsx
      GoalResultPanel.tsx
      MacroSummary.tsx
      RecalculateButton.tsx

    common/
      PageLayout.tsx
      SectionCard.tsx
      RadioGroupField.tsx
      NumberInputField.tsx
      Button.tsx

  contexts/
    TdeeCalculatorContext.tsx

  hooks/
    useTdeeCalculator.ts

  utils/
    calculations/
      bmr.ts
      tdee.ts
      goalCalories.ts
      macros.ts

  constants/
    activityLevels.ts
    macroPlans.ts
    routes.ts

  types/
    calculator.ts

  styles/
    (기존 프로젝트 구조 유지, 필요 시 최소 수정)
```

### 파일 구조 원칙
- 페이지 파일에는 화면 조합만 담당시킨다.
- 입력 섹션은 input 폴더에서 분리한다.
- 결과 탭 관련 UI는 result 폴더에서 분리한다.
- 공통 입력 컴포넌트는 common 폴더로 분리한다.
- 계산 함수는 utils/calculations 하위에 모은다.

---

## 8. 컴포넌트 분리 기준

## 8-1. 페이지 컴포넌트
- IntroPage
- InputPage
- ResultPage

페이지 컴포넌트는 데이터 조합과 섹션 배치만 담당한다.
복잡한 계산 로직을 포함하지 않는다.

---

## 8-2. 입력 페이지 컴포넌트

### InputForm
- 입력 페이지 전체 폼 조합

### BasicInfoSection
- 성별
- 나이

### BodyInfoSection
- 키
- 몸무게

### ActivityLevelSection
- 활동량 선택지 렌더링

### AdditionalInfoSection
- 체지방률 입력

### CalculateButton
- 폼 제출 버튼

---

## 8-3. 결과 페이지 컴포넌트

### ResultHeader
- TDEE 노출

### GoalTabs
- 감량 / 유지 / 벌크업 탭 렌더링

### GoalResultPanel
- 선택된 목표의 칼로리/탄단지 결과 렌더링

### MacroSummary
- 탄/단/지 비율 및 g 표시

### RecalculateButton
- 입력 페이지 이동 버튼

---

## 8-4. 공통 UI 컴포넌트

### PageLayout
- 페이지 공통 레이아웃

### SectionCard
- 섹션 카드 스타일 컨테이너

### RadioGroupField
- 성별 / 활동량 입력 공통 처리

### NumberInputField
- 나이 / 키 / 몸무게 / 체지방률 입력 공통 처리

### Button
- 공통 버튼

---

## 9. 계산 로직 파일 설계
계산 로직은 기능별 함수 분리 구조를 사용한다.

## 9-1. `bmr.ts`
포함 함수 예시
- `calculateBmrWithMifflin(...)`
- `calculateBmrWithKatch(...)`
- `calculateBmrByInput(...)`

역할
- 입력값을 받아 적절한 BMR 계산 수행
- 체지방률 유무에 따라 공식 분기

---

## 9-2. `tdee.ts`
포함 함수 예시
- `calculateTdee(bmr, activityMultiplier)`

역할
- BMR에 활동량 계수 반영

---

## 9-3. `goalCalories.ts`
포함 함수 예시
- `calculateGoalCalories(tdee)`

역할
- 감량 / 유지 / 벌크업 목표 칼로리 계산
- 반환값은 목표별 객체 구조로 통일

---

## 9-4. `macros.ts`
포함 함수 예시
- `calculateMacros(calories, goalType)`
- `convertMacroCaloriesToGrams(...)`

역할
- 목표별 탄단지 비율 계산
- 탄단지 g 환산

---

## 9-5. 계산 조합 원칙
입력 페이지에서 아래 순서로 계산 호출

1. `calculateBmrByInput(inputData)`
2. `calculateTdee(...)`
3. `calculateGoalCalories(...)`
4. 목표별로 `calculateMacros(...)`

---

## 10. 타입 정의
`types/calculator.ts`에 아래 타입을 정의한다.

### InputData
- gender
- age
- height
- weight
- activityLevel
- bodyFatPercentage?

### GoalType
- `cut`
- `maintain`
- `bulk`

### MacroResult
- carbsPercent
- carbsGrams
- proteinPercent
- proteinGrams
- fatPercent
- fatGrams

### GoalResult
- calories
- macros

### CalculationResult
- bmr
- tdee
- goals

### ContextValue
- inputData
- resultData
- setInputData
- setResultData
- resetCalculator

---

## 11. 활동량 상수 정의
`constants/activityLevels.ts`에 활동량 선택지를 상수로 정의한다.

각 항목은 아래 정보를 포함한다.
- id
- label
- description
- multiplier

예시 구조
- sedentary
- light
- moderate
- active
- veryActive

UI에서는 label + description 표시
계산에는 multiplier 사용

---

## 12. 라우팅 설계
`constants/routes.ts` 또는 라우터 설정 파일에서 아래 경로를 사용한다.

- `/`
- `/input`
- `/result`

### 라우팅 규칙
- 인트로 CTA → `/input`
- 입력 계산 완료 → `/result`
- 결과 직접 진입 + 결과 없음 → `/input`
- 다시 계산하기 → `/input`

---

## 13. 유효성 검사 규칙
입력 페이지에서 아래 검증을 수행한다.

### 필수
- 성별 필수
- 나이 필수
- 키 필수
- 몸무게 필수
- 활동량 필수

### 선택
- 체지방률은 비어 있어도 됨

### 숫자 검증
- 숫자 필드는 숫자만 허용
- 음수 불가
- 0 불가

### 오류 처리
- 각 필드별 오류 메시지 표시
- 오류가 있으면 계산 실행 금지

---

## 14. UI 구현 가이드

### 전체 방향
- 모바일 우선
- 깔끔한 카드형 섹션 UI
- 상단 메뉴 등 완성도 있는 느낌의 페이지 구성
- 기존 서비스보다 한 단계 더 정리된 인상으로 개선

### 입력 페이지
- 섹션 간 간격 분명하게 유지
- 활동량 선택지는 설명이 잘 보이도록 구성
- 계산 버튼은 하단에서 명확하게 강조

### 결과 페이지
- TDEE 상단 고정 정보처럼 강조
- 감량 / 유지 / 벌크업 탭은 클릭 즉시 전환
- 각 목표 결과는 카드 또는 패널 형태로 정리
- 다시 계산하기 버튼은 하단 CTA로 명확히 노출

---

## 15. 기존 프로젝트 수정 원칙
- 기존 프로젝트를 전면 재작성하지 말고, 현재 구조를 확인한 뒤 필요한 파일만 수정 또는 추가한다.
- 단, 현재 구조가 위 설계를 수용하지 못하는 경우에는 관련 파일 범위 내에서 리팩터링 허용
- 불필요한 패키지 추가 금지
- 상태 관리 라이브러리 추가 금지 (Redux, Zustand 등 금지)
- Context API만 사용

---

## 16. 최종 구현 산출물
코덱스 CLI는 아래 결과를 만들어야 한다.

1. 인트로 페이지 구현
2. 입력 페이지 구현
3. 결과 페이지 구현
4. Context API 상태 관리 구현
5. 계산 로직 유틸 파일 분리 구현
6. 라우팅 연결
7. 입력 검증 구현
8. 결과 페이지 탭 UI 구현
9. 다시 계산하기 버튼 구현

---

## 17. 코덱스 CLI 작업 지시
아래 원칙으로 작업하라.

- 현재 프로젝트 구조를 먼저 분석하라.
- 기존 배포 서비스의 핵심 기능은 유지하되, 본 문서 기준으로 구조를 재정리하라.
- 새 파일이 필요하면 생성하라.
- 기존 파일 수정이 필요하면 수정하라.
- 타입스크립트 기준으로 타입을 명확히 작성하라.
- 계산 로직은 반드시 함수 분리 구조를 지켜라.
- 결과 페이지는 반드시 탭 UI 구조를 사용하라.
- 결과 페이지는 계산 로직을 포함하지 말고 표시만 담당하게 하라.
- 작업 완료 후, 생성/수정한 파일 목록과 각 파일 역할을 요약하라.

