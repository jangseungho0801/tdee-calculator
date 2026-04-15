import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import IntroHero from '../components/intro/IntroHero.tsx'
import IntroHighlights from '../components/intro/IntroHighlights.tsx'
import StartButton from '../components/intro/StartButton.tsx'
import { ROUTES } from '../constants/routes'

const Stack = styled.div`
  display: grid;
  gap: 18px;
`

function IntroPage() {
  return (
    <PageLayout>
      <Stack>
        <IntroHero
          title="당신의 루틴에 맞춘 TDEE 계산기"
          description="감량, 유지, 벌크업까지 한 번에 비교하고 체지방률 입력 여부에 따라 계산 공식을 자동으로 분기"
        />
        <IntroHighlights
          items={[
            {
              title: '입력과 결과를 분리',
              description: '입력은 한 화면에서 마치고 결과 페이지는 표시만 담당하도록 구조를 정리했습니다.',
            },
            {
              title: '공식 자동 분기',
              description: '체지방률이 있으면 Katch-McArdle, 없으면 Mifflin-St Jeor를 사용합니다.',
            },
            {
              title: '목표별 탭 제공',
              description: '감량, 유지, 벌크업 칼로리와 탄단지 구성을 즉시 비교할 수 있습니다.',
            },
          ]}
        />
        <StartButton onClick={() => navigateTo(ROUTES.input)} />
      </Stack>
    </PageLayout>
  )
}

export default IntroPage
