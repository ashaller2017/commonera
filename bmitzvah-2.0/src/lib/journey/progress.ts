export type MilestoneStatus = 'todo' | 'in_progress' | 'done'

export type JourneyProgress = {
  readonly done: number
  readonly total: number
  readonly percent: number
}

export function journeyProgress(statuses: readonly MilestoneStatus[]): JourneyProgress {
  const total = statuses.length
  const done = statuses.filter((status) => status === 'done').length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return { done, total, percent }
}
