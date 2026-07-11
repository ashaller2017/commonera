import { createFormHookContexts } from '@tanstack/react-form'

// Shared contexts for the app's form composition. `useFieldContext` / `useFormContext`
// are consumed by the reusable field and form components in this directory.
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()
