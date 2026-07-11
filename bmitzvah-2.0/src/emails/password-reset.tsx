import { Section } from 'react-email'
import { BrandButton, EmailHeading, EmailLayout, EmailText } from '@/emails/components'

export type PasswordResetEmailProps = {
  resetUrl: string
  name?: string
}

export function PasswordResetEmail({ resetUrl, name }: PasswordResetEmailProps) {
  const firstName = name ? name.split(' ')[0] : null
  return (
    <EmailLayout preview="Reset your B'Mitzvah Coach password">
      <EmailHeading>Reset your password</EmailHeading>
      <EmailText>
        {firstName ? `Hi ${firstName}, ` : ''}we got a request to reset the password on your
        B'Mitzvah Coach account. Choose a new one below. This link expires in an hour.
      </EmailText>
      <Section style={{ margin: '8px 0 16px' }}>
        <BrandButton href={resetUrl}>Choose a new password</BrandButton>
      </Section>
      <EmailText muted>
        If you didn't ask for this, you can safely ignore this email, your password won't change.
      </EmailText>
    </EmailLayout>
  )
}

PasswordResetEmail.PreviewProps = {
  resetUrl: 'http://127.0.0.1:3000/reset-password?token_hash=preview&type=recovery',
  name: 'Ari',
} satisfies PasswordResetEmailProps

export default PasswordResetEmail
