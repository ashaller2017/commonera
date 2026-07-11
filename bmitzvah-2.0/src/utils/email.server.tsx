import { render } from '@react-email/components'
import type { ReactElement } from 'react'
import { Resend } from 'resend'
import { ChildProgressEmail } from '@/emails/child-progress'
import { PasswordResetEmail } from '@/emails/password-reset'
import { WelcomeEmail } from '@/emails/welcome'
import { env } from '@/utils/env.server'

// Server-only email sender. Never import from client code. With no RESEND_API_KEY (local dev),
// emails are rendered and logged to the console (with any link) rather than sent, so flows are
// testable offline. `deliver` never throws; callers can await it without guarding.

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

async function deliver(args: {
  to: string
  subject: string
  element: ReactElement
  devLink?: string
}): Promise<void> {
  const { to, subject, element, devLink } = args
  try {
    const [html, text] = await Promise.all([render(element), render(element, { plainText: true })])
    if (!resend) {
      console.info(
        `[email] dev (not sent) to=${to} subject=${JSON.stringify(subject)}${
          devLink ? ` link=${devLink}` : ''
        }`,
      )
      return
    }
    const { error } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html, text })
    if (error) console.error('[email] send failed', { to, subject, error })
  } catch (err) {
    console.error('[email] render/send threw', { to, subject, err })
  }
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await deliver({
    to,
    subject: "Welcome to B'Mitzvah Coach",
    element: <WelcomeEmail name={name} appUrl={env.SITE_URL} />,
  })
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  name?: string,
): Promise<void> {
  await deliver({
    to,
    subject: "Reset your B'Mitzvah Coach password",
    element: <PasswordResetEmail resetUrl={resetUrl} name={name} />,
    devLink: resetUrl,
  })
}

export async function sendChildMilestoneEmail(
  to: string,
  args: {
    childName: string
    journeyName: string
    childId: string
    milestoneTitle: string
    done: number
    total: number
  },
): Promise<void> {
  await deliver({
    to,
    subject: `${args.childName.split(' ')[0] || args.childName} hit a milestone`,
    element: <ChildProgressEmail kind="milestone" appUrl={env.SITE_URL} {...args} />,
  })
}

export async function sendChildFinishedEmail(
  to: string,
  args: { childName: string; journeyName: string; childId: string },
): Promise<void> {
  await deliver({
    to,
    subject: `${args.childName.split(' ')[0] || args.childName} finished their journey`,
    element: <ChildProgressEmail kind="finished" appUrl={env.SITE_URL} {...args} />,
  })
}
