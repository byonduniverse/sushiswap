import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Form } from '@sushiswap/ui'
import { FC, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'

import { CliffDetailsSection } from './CliffDetailsSection'
import CreateFormReviewModal from './CreateFormReviewModal'
import { GeneralDetailsSection } from './GeneralDetailsSection'
import { GradedVestingDetailsSection } from './GradedVestingDetailsSection'
import { createVestingSchema, stepConfigurations } from './schema'
import { transformVestingFormData } from './transformVestingFormData'
import { CreateVestingFormData, CreateVestingFormDataValidated } from './types'

export const CreateForm: FC = () => {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const [review, setReview] = useState(false)

  const methods = useForm<CreateVestingFormData>({
    // @ts-ignore
    resolver: yupResolver(createVestingSchema),
    defaultValues: {
      currency: undefined,
      cliff: false,
      startDate: undefined,
      recipient: undefined,
      cliffEndDate: undefined,
      cliffAmount: '',
      stepPayouts: 1,
      stepAmount: '',
      stepConfig: stepConfigurations[0],
      fundSource: undefined,
      insufficientBalance: false,
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    watch,
    reset,
  } = methods

  const formData = watch()
  const validatedData =
    isValid && !isValidating ? transformVestingFormData(formData as CreateVestingFormDataValidated) : undefined

  useEffect(() => {
    reset()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain?.id, account?.address])

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create vesting" onSubmit={methods.handleSubmit(() => setReview(true))}>
          <GeneralDetailsSection />
          <CliffDetailsSection />
          <GradedVestingDetailsSection />
          <Form.Buttons>
            <Button type="submit" color="blue" disabled={!isValid || isValidating}>
              Review Details
            </Button>
          </Form.Buttons>
        </Form>
      </FormProvider>
      {validatedData && (
        <CreateFormReviewModal open={review} onDismiss={() => setReview(false)} formData={validatedData} />
      )}
    </>
  )
}
