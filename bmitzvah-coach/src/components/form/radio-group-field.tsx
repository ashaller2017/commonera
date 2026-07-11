import { useFieldContext } from '@/components/form/form-context'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type RadioOption = {
  readonly label: string
  readonly value: string
}

type RadioGroupFieldProps = {
  label: string
  description?: string
  options: readonly RadioOption[]
}

// Reusable single-choice radio group, bound to the current field via context.
export function RadioGroupField({ label, description, options }: RadioGroupFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const labelId = `${field.name}-label`

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value == null ? '' : String(value))}
        aria-labelledby={labelId}
        aria-invalid={isInvalid}
      >
        {options.map((option) => {
          const optionId = `${field.name}-${option.value}`
          return (
            <FieldLabel key={option.value} htmlFor={optionId} className="font-normal">
              <RadioGroupItem id={optionId} value={option.value} onBlur={field.handleBlur} />
              {option.label}
            </FieldLabel>
          )
        })}
      </RadioGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
