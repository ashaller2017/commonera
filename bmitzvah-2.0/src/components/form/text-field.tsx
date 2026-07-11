import type * as React from 'react'

import { useFieldContext } from '@/components/form/form-context'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type TextFieldProps = {
  label: string
  description?: string
} & Omit<
  React.ComponentProps<typeof Input>,
  'id' | 'name' | 'value' | 'onChange' | 'onBlur' | 'aria-invalid'
>

// Reusable text field (use `type` for email/password/etc.), bound to the current field via context.
export function TextField({ label, description, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...inputProps}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
