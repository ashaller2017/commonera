import { createFormHook } from '@tanstack/react-form'

import { CheckboxField } from '@/components/form/checkbox-field'
import { fieldContext, formContext } from '@/components/form/form-context'
import { FormError } from '@/components/form/form-error'
import { NumberField } from '@/components/form/number-field'
import { RadioGroupField } from '@/components/form/radio-group-field'
import { SelectField } from '@/components/form/select-field'
import { StringListField } from '@/components/form/string-list-field'
import { SubmitButton } from '@/components/form/submit-button'
import { SwitchField } from '@/components/form/switch-field'
import { TextField } from '@/components/form/text-field'
import { TextareaField } from '@/components/form/textarea-field'

// App-wide form hook. `useAppForm` yields a form whose `AppField` children expose the
// registered `fieldComponents` (e.g. `field.TextField`) and whose `AppForm` exposes the
// registered `formComponents` (e.g. `form.SubmitButton`, `form.FormError`).
export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    TextareaField,
    SelectField,
    CheckboxField,
    SwitchField,
    RadioGroupField,
    StringListField,
  },
  formComponents: {
    FormError,
    SubmitButton,
  },
})

export { useFieldContext, useFormContext } from '@/components/form/form-context'
