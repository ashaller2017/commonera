import type { ReactNode } from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email'

// Email-safe hex approximations of the app's brand tokens (email clients don't support oklch).
export const brand = {
  teal: '#16847e',
  ink: '#1b2528',
  muted: '#5f6d70',
  gold: '#e6c45c',
  soft: '#f2f6f5',
  border: '#e3e9e8',
  white: '#ffffff',
}

const fontSans = "'Nunito Sans', -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
const fontDisplay = "Georgia, 'Times New Roman', serif"

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: brand.soft,
          margin: 0,
          padding: '24px 0',
          fontFamily: fontSans,
          color: brand.ink,
        }}
      >
        <Container
          style={{
            backgroundColor: brand.white,
            borderRadius: 16,
            border: `1px solid ${brand.border}`,
            maxWidth: 480,
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <Section style={{ padding: '28px 32px 0' }}>
            <Text
              style={{
                margin: 0,
                fontFamily: fontDisplay,
                fontSize: 20,
                fontWeight: 700,
                color: brand.teal,
                letterSpacing: '-0.01em',
              }}
            >
              B'Mitzvah Coach
            </Text>
          </Section>
          <Section style={{ padding: '4px 32px 28px' }}>{children}</Section>
          <Hr style={{ borderColor: brand.border, margin: 0 }} />
          <Section style={{ padding: '18px 32px' }}>
            <Text style={{ margin: 0, fontSize: 12, color: brand.muted, lineHeight: '18px' }}>
              You're getting this because you have a B'Mitzvah Coach family account. Questions? Just
              reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function EmailHeading({ children }: { children: ReactNode }) {
  return (
    <Heading
      style={{
        fontFamily: fontDisplay,
        fontSize: 26,
        fontWeight: 700,
        color: brand.ink,
        margin: '16px 0 10px',
      }}
    >
      {children}
    </Heading>
  )
}

export function EmailText({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <Text
      style={{
        fontSize: 15,
        lineHeight: '24px',
        color: muted ? brand.muted : brand.ink,
        margin: '0 0 16px',
      }}
    >
      {children}
    </Text>
  )
}

export function BrandButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: brand.teal,
        color: brand.white,
        borderRadius: 999,
        padding: '12px 26px',
        fontSize: 15,
        fontWeight: 700,
        textDecoration: 'none',
        display: 'inline-block',
      }}
    >
      {children}
    </Button>
  )
}
