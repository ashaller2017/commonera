import type { ContentError } from '@/utils/admin-content.server'

// Human copy for the content-mutation Result union, shared by every editor.
export const CONTENT_ERROR_COPY: Record<ContentError, string> = {
  'not-admin': "You don't have permission to do that.",
  'write-failed': 'Something went wrong saving. Try again.',
  conflict: 'That id/slug is already taken. Pick another.',
  'has-references': 'This is still referenced elsewhere and cannot be removed.',
}
