import type * as React from 'react'

import { useFieldContext } from '@/components/form/form-context'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

type TextareaFieldProps = {
  label: string
  description?: string
} & Omit<
  React.ComponentProps<typeof Textarea>,
  'id' | 'name' | 'value' | 'onChange' | 'onBlur' | 'aria-invalid'
>

// Reusable multi-line text field, bound to the current field via context.
export function TextareaField({ label, description, ...textareaProps }: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...textareaProps}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
