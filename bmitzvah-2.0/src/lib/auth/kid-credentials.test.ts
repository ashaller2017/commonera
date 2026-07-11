import { describe, expect, it } from 'vitest'
import { isValidUsername, kidEmailFor, normalizeUsername } from './kid-credentials'

describe('normalizeUsername', () => {
  it('lowercases and trims', () => {
    expect(normalizeUsername('  LeoTheBrave ')).toBe('leothebrave')
  })
})

describe('isValidUsername', () => {
  it('accepts lowercase letters, digits and underscores within length bounds', () => {
    expect(isValidUsername('leo_12')).toBe(true)
    expect(isValidUsername('abc')).toBe(true)
    expect(isValidUsername('a'.repeat(20))).toBe(true)
  })

  it('rejects invalid characters, spaces and bad lengths', () => {
    expect(isValidUsername('ab')).toBe(false)
    expect(isValidUsername('a'.repeat(21))).toBe(false)
    expect(isValidUsername('Leo')).toBe(false)
    expect(isValidUsername('leo!')).toBe(false)
    expect(isValidUsername('leo smith')).toBe(false)
    expect(isValidUsername('leo@kids')).toBe(false)
  })
})

describe('kidEmailFor', () => {
  it('maps a username onto the reserved kid domain', () => {
    expect(kidEmailFor('leo_12')).toBe('leo_12@kids.bmitzvah.app')
  })
})
