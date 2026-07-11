import { render } from 'react-email'
import { describe, expect, it } from 'vitest'
import { ChildProgressEmail } from '@/emails/child-progress'
import { PasswordResetEmail } from '@/emails/password-reset'
import { WelcomeEmail } from '@/emails/welcome'

// React's static markup inserts `<!-- -->` markers between adjacent {expressions} and text.
// Strip them so content assertions read the way the recipient sees it.
const text = (html: string) => html.replace(/<!-- -->/g, '')

describe('email templates', () => {
  it('welcome greets by first name and links to the dashboard', async () => {
    const html = text(await render(<WelcomeEmail name="Ari Shaller" appUrl="https://app.test" />))
    expect(html).toContain('Welcome, Ari')
    expect(html).toContain('https://app.test/parent')
  })

  it('password reset carries the reset link and the expiry note', async () => {
    const url = 'https://app.test/reset-password?token_hash=abc123'
    const html = text(await render(<PasswordResetEmail resetUrl={url} name="Ari" />))
    expect(html).toContain(url)
    expect(html).toContain('expires in an hour')
  })

  it('milestone email names the milestone, journey, and progress', async () => {
    const html = text(
      await render(
        <ChildProgressEmail
          kind="milestone"
          childName="Noa Berg"
          journeyName="Into the Wild"
          appUrl="https://app.test"
          childId="kid-1"
          milestoneTitle="Learn the Land"
          done={3}
          total={6}
        />,
      ),
    )
    expect(html).toContain('Learn the Land')
    expect(html).toContain('Into the Wild')
    expect(html).toContain('3 of 6')
    expect(html).toContain('https://app.test/parent/kids/kid-1')
  })

  it('finished email celebrates completing the journey', async () => {
    const html = text(
      await render(
        <ChildProgressEmail
          kind="finished"
          childName="Noa Berg"
          journeyName="Into the Wild"
          appUrl="https://app.test"
          childId="kid-1"
        />,
      ),
    )
    expect(html).toContain('Noa did it')
    expect(html).toContain('Into the Wild')
  })
})
