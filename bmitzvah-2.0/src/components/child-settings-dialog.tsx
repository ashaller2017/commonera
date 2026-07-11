import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { type ReactElement, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ChoiceOption, ComfortKey, TimelineKey } from '@/lib/content/types'
import { fetchChildSettingsFn, upsertChildSettingsFn } from '@/utils/child-settings.functions'

export type SetupOptions = {
  readonly timeline: readonly ChoiceOption<TimelineKey>[]
  readonly comfort: readonly ChoiceOption<ComfortKey>[]
}

// The two parent-facing questions about a kid, phrased about the child. Shared
// between the add-kid dialog's second step and the standalone edit dialog.
export function ChildSettingsSelects({
  kidName,
  options,
  timeline,
  comfort,
  onTimelineChange,
  onComfortChange,
}: {
  kidName: string
  options: SetupOptions
  timeline: TimelineKey | null
  comfort: ComfortKey | null
  onTimelineChange: (value: TimelineKey) => void
  onComfortChange: (value: ComfortKey) => void
}) {
  const firstName = kidName.split(' ')[0] || kidName
  // items maps value -> label so a pre-filled (closed) trigger shows the
  // human label rather than the raw key.
  const timelineItems = Object.fromEntries(options.timeline.map((o) => [o.key, o.label]))
  const comfortItems = Object.fromEntries(options.comfort.map((o) => [o.key, o.label]))
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="child-timeline">When will {firstName} celebrate?</Label>
        <Select
          items={timelineItems}
          value={timeline ?? undefined}
          onValueChange={(value) => onTimelineChange(value as TimelineKey)}
        >
          <SelectTrigger id="child-timeline" className="w-full">
            <SelectValue placeholder="Pick what feels right" />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              {options.timeline.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="child-comfort">
          How Jewish-traditional should {firstName}'s journey feel?
        </Label>
        <Select
          items={comfortItems}
          value={comfort ?? undefined}
          onValueChange={(value) => onComfortChange(value as ComfortKey)}
        >
          <SelectTrigger id="child-comfort" className="w-full">
            <SelectValue placeholder="Every answer is a good answer" />
          </SelectTrigger>
          <SelectPositioner>
            <SelectContent>
              {options.comfort.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </div>
    </>
  )
}

// Standalone "About <kid>" dialog for answering or editing the settings after
// the kid already exists. Current values load on open, so a kid who answered
// under the old kid-facing setup step shows those answers pre-filled.
export function ChildSettingsDialog({
  childId,
  kidName,
  options,
  trigger,
  triggerLabel,
}: {
  childId: string
  kidName: string
  options: SetupOptions
  trigger: ReactElement
  triggerLabel: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const firstName = kidName.split(' ')[0] || kidName
  const settings = useQuery({
    queryKey: ['child-settings', childId],
    queryFn: () => fetchChildSettingsFn({ data: { childId } }),
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>{triggerLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">About {firstName}</DialogTitle>
          <DialogDescription>
            Two quick questions about the celebration — they shape the journey the quiz suggests.
            You can change these anytime.
          </DialogDescription>
        </DialogHeader>
        {settings.data ? (
          <ChildSettingsForm
            childId={childId}
            kidName={kidName}
            options={options}
            initialTimeline={settings.data.timeline}
            initialComfort={settings.data.comfort}
            onSaved={() => setOpen(false)}
          />
        ) : (
          <p className="py-2 text-sm text-muted-foreground">One moment...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ChildSettingsForm({
  childId,
  kidName,
  options,
  initialTimeline,
  initialComfort,
  onSaved,
}: {
  childId: string
  kidName: string
  options: SetupOptions
  initialTimeline: TimelineKey | null
  initialComfort: ComfortKey | null
  onSaved: () => void
}) {
  const router = useRouter()
  const [timeline, setTimeline] = useState<TimelineKey | null>(initialTimeline)
  const [comfort, setComfort] = useState<ComfortKey | null>(initialComfort)
  const mutation = useMutation({
    mutationFn: () => upsertChildSettingsFn({ data: { childId, timeline, comfort } }),
    onSuccess: async (result) => {
      if (result.ok) {
        await router.invalidate()
        onSaved()
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate()
      }}
    >
      <ChildSettingsSelects
        kidName={kidName}
        options={options}
        timeline={timeline}
        comfort={comfort}
        onTimelineChange={setTimeline}
        onComfortChange={setComfort}
      />
      {mutation.data && !mutation.data.ok ? (
        <p className="text-sm font-bold text-destructive" role="alert">
          That didn't save. Give it another try in a moment.
        </p>
      ) : null}
      <Button type="submit" disabled={mutation.isPending || (!timeline && !comfort)}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
