import type * as React from 'react'

import { useFieldContext } from '@/components/form/form-context'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type NumberFieldProps = {
  label: string
  description?: string
} & Omit<
  React.ComponentProps<typeof Input>,
  'id' | 'name' | 'type' | 'value' | 'onChange' | 'onBlur' | 'aria-invalid'
>

// Reusable numeric field. The field value is a real `number`; an empty input reads as NaN so a
// Zod `z.number()` validator can reject it rather than silently coercing to 0. Initialize the
// field to a number or `Number.NaN` in `defaultValues` so the input stays controlled.
export function NumberField({ label, description, ...inputProps }: NumberFieldProps) {
  const field = useFieldContext<number>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        inputMode="numeric"
        value={
          typeof field.state.value === 'number' && !Number.isNaN(field.state.value)
            ? field.state.value
            : ''
        }
        onBlur={field.handleBlur}
        onChange={(e) =>
          field.handleChange(e.target.value === '' ? Number.NaN : e.target.valueAsNumber)
        }
        aria-invalid={isInvalid}
        {...inputProps}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
