import { Plus, X } from 'lucide-react'
import { useFieldContext } from '@/components/form/form-context'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type StringListFieldProps = {
  label: string
  description?: string
  addLabel?: string
  placeholder?: string
}

// Reusable editor for a `string[]` field: one input per item, add/remove rows.
// Bound to the whole array via context, so it slots into the form kit like any
// other field.
export function StringListField({
  label,
  description,
  addLabel = 'Add item',
  placeholder,
}: StringListFieldProps) {
  const field = useFieldContext<string[]>()
  const items = field.state.value ?? []
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const set = (next: string[]) => field.handleChange(next)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: inputs are positional; add/remove is at the row level
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onBlur={field.handleBlur}
              onChange={(e) => set(items.map((v, i) => (i === index ? e.target.value : v)))}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove"
              onClick={() => set(items.filter((_, i) => i !== index))}
            >
              <X aria-hidden />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => set([...items, ''])}
        >
          <Plus aria-hidden />
          {addLabel}
        </Button>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
