import { useFieldContext } from '@/components/form/form-context'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectOption = {
  readonly label: string
  readonly value: string
}

type SelectFieldProps = {
  label: string
  description?: string
  placeholder?: string
  options: readonly SelectOption[]
}

// Reusable single-select field, bound to the current field via context.
export function SelectField({ label, description, placeholder, options }: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        items={options}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value == null ? '' : String(value))}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectPositioner>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
