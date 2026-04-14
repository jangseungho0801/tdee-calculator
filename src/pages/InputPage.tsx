import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import InputForm from '../components/input/InputForm.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'

const Grid = styled.div`
  display: grid;
  gap: 18px;
`

function InputPage() {
  const { inputData, setInputData, setResultData } = useTdeeCalculator()

  return (
    <PageLayout>
      <Grid>
        <InputForm
          inputData={inputData}
          setInputData={setInputData}
          setResultData={setResultData}
          onSuccess={() => navigateTo(ROUTES.result)}
        />
      </Grid>
    </PageLayout>
  )
}

export default InputPage
