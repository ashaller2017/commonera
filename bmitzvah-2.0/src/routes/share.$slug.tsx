import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { JourneyCardView } from '@/components/journey-card'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/wordmark'
import { fetchSharedCardFn } from '@/utils/share.functions'

export const Route = createFileRoute('/share/$slug')({
  loader: ({ params }) => fetchSharedCardFn({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const card = loaderData?.card
    const base = loaderData?.baseUrl ?? ''
    if (!card) {
      return {
        meta: [
          { title: "Journey not found · B'Mitzvah 2.0" },
          { name: 'robots', content: 'noindex' },
        ],
      }
    }
    const title = `${card.firstName}'s B'Mitzvah journey: ${card.journeyName}`
    // Taglines may or may not end in punctuation; strip it so the sentence join
    // never doubles the period ("found it.. 4 of 6" -> "found it. 4 of 6").
    const tagline = card.templateTagline.replace(/[.!?]+$/, '')
    const description = `${card.templateName} · ${tagline}. ${card.milestonesDone} of ${card.milestonesTotal} milestones so far.`
    const image = `${base}/og/${params.slug}`
    const url = `${base}/share/${params.slug}`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: url },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
    }
  },
  component: SharePage,
})

function SharePage() {
  const { card } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6">
        {card ? (
          <>
            <JourneyCardView
              template={card.template}
              journeyName={card.journeyName}
              firstName={card.firstName}
              themes={card.themes}
              milestonesDone={card.milestonesDone}
              milestonesTotal={card.milestonesTotal}
              activities={card.activities}
              celebration={card.celebration}
            />
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-muted-foreground text-sm">
                Every kid designs their own B'Mitzvah, their way.
              </p>
              <Button size="lg" render={<Link to="/signup" />}>
                Start your own journey
                <ArrowRight aria-hidden />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <span className="text-5xl" aria-hidden>
              🧭
            </span>
            <h1 className="font-display font-semibold text-3xl">This card isn't here</h1>
            <p className="text-muted-foreground">
              The link may be wrong or the journey was removed. Why not start your own?
            </p>
            <Button size="lg" render={<Link to="/signup" />}>
              Start your journey
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
