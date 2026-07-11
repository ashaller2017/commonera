import { useFormContext } from '@/components/form/form-context'
import { FieldError } from '@/components/ui/field'

// Extract the form-level message set by an `onSubmitAsync` validator returning `{ form }`,
// tolerating both the string and object representations across TanStack Form versions.
function formLevelMessage(error: unknown): string | undefined {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'form' in error) {
    const { form } = error as { form?: unknown }
    return typeof form === 'string' ? form : undefined
  }
  return undefined
}

// Reusable form-level error, bound to the current form via context. Surfaces server-side
// submission failures (returned as `{ form }` from `validators.onSubmitAsync`).
export function FormError() {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(error) => {
        const message = formLevelMessage(error)
        return message ? <FieldError className="font-bold">{message}</FieldError> : null
      }}
    </form.Subscribe>
  )
}
