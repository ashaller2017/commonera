import { Section } from 'react-email'
import { BrandButton, EmailHeading, EmailLayout, EmailText } from '@/emails/components'

export type WelcomeEmailProps = {
  name: string
  appUrl: string
}

export function WelcomeEmail({ name, appUrl }: WelcomeEmailProps) {
  const firstName = name.split(' ')[0] || name
  return (
    <EmailLayout preview="Welcome to B'Mitzvah 2.0">
      <EmailHeading>Welcome, {firstName}!</EmailHeading>
      <EmailText>
        Thanks for setting up your family account. Here's the idea: you handle the setup, and your
        kid designs their own b'mitzvah journey, at their own pace.
      </EmailText>
      <EmailText>
        Next up, add your kid's login so they can take the quiz and start building their path. We'll
        email you as they hit milestones.
      </EmailText>
      <Section style={{ margin: '8px 0 4px' }}>
        <BrandButton href={`${appUrl}/parent`}>Open your family dashboard</BrandButton>
      </Section>
    </EmailLayout>
  )
}

WelcomeEmail.PreviewProps = {
  name: 'Ari',
  appUrl: 'http://127.0.0.1:3000',
} satisfies WelcomeEmailProps

export default WelcomeEmail
