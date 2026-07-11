import type * as React from 'react'

import { useFormContext } from '@/components/form/form-context'
import { Button } from '@/components/ui/button'

type SubmitButtonProps = {
  submittingLabel?: React.ReactNode
} & React.ComponentProps<typeof Button>

// Reusable submit control, bound to the current form via context. Disables itself while the
// form is submitting and can swap to a pending label.
export function SubmitButton({ children, submittingLabel, disabled, ...props }: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting || disabled} {...props}>
          {isSubmitting && submittingLabel ? submittingLabel : children}
        </Button>
      )}
    </form.Subscribe>
  )
}
