export type UserId = string & { readonly __brand: 'UserId' }

export type JourneyId = string & { readonly __brand: 'JourneyId' }

export const asUserId = (id: string): UserId => id as UserId

export const asJourneyId = (id: string): JourneyId => id as JourneyId
