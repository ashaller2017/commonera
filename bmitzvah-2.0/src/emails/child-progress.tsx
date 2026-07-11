import { Section } from 'react-email'
import { BrandButton, EmailHeading, EmailLayout, EmailText } from '@/emails/components'

export type ChildProgressEmailProps = {
  childName: string
  journeyName: string
  appUrl: string
  childId: string
} & (
  | { kind: 'milestone'; milestoneTitle: string; done: number; total: number }
  | { kind: 'finished' }
)

export function ChildProgressEmail(props: ChildProgressEmailProps) {
  const { childName, journeyName, appUrl, childId } = props
  const firstName = childName.split(' ')[0] || childName
  const journeyHref = `${appUrl}/parent/kids/${childId}`

  if (props.kind === 'finished') {
    return (
      <EmailLayout preview={`${firstName} finished their journey`}>
        <EmailHeading>{firstName} did it!</EmailHeading>
        <EmailText>
          {firstName} just completed every milestone in "{journeyName}". That's the whole journey,
          start to finish.
        </EmailText>
        <EmailText>Time to celebrate. Open their journey to see everything they built.</EmailText>
        <Section style={{ margin: '8px 0 4px' }}>
          <BrandButton href={journeyHref}>See {firstName}'s journey</BrandButton>
        </Section>
      </EmailLayout>
    )
  }

  return (
    <EmailLayout preview={`${firstName} completed a milestone`}>
      <EmailHeading>{firstName} hit a milestone</EmailHeading>
      <EmailText>
        {firstName} just marked "{props.milestoneTitle}" done in "{journeyName}". That's{' '}
        {props.done} of {props.total} milestones.
      </EmailText>
      <Section style={{ margin: '8px 0 4px' }}>
        <BrandButton href={journeyHref}>See {firstName}'s progress</BrandButton>
      </Section>
    </EmailLayout>
  )
}

ChildProgressEmail.PreviewProps = {
  childName: 'Noa',
  journeyName: 'Into the Wild',
  appUrl: 'http://127.0.0.1:3000',
  childId: '00000000-0000-0000-0000-000000000000',
  kind: 'milestone',
  milestoneTitle: 'Learn the Land',
  done: 3,
  total: 6,
} satisfies ChildProgressEmailProps

export default ChildProgressEmail
