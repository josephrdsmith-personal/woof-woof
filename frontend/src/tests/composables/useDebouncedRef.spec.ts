import { describe, it, expect, vi } from 'vitest'
import { useDebouncedRef } from '../../composables/useDebouncedRef'
import { nextTick } from 'vue'

describe('useDebouncedRef', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce value updates', async () => {
    const debouncedRef = useDebouncedRef('initial', 100)
    
    expect(debouncedRef.value).toBe('initial')
    
    debouncedRef.value = 'changed'
    expect(debouncedRef.value).toBe('initial') // Still initial before timeout
    
    vi.advanceTimersByTime(50)
    expect(debouncedRef.value).toBe('initial') // Still initial before timeout
    
    vi.advanceTimersByTime(50)
    await nextTick()
    expect(debouncedRef.value).toBe('changed') // Changed after timeout
  })

  it('should cancel previous timeout on rapid updates', async () => {
    const debouncedRef = useDebouncedRef('initial', 100)
    
    debouncedRef.value = 'first'
    debouncedRef.value = 'second'
    
    vi.advanceTimersByTime(50)
    expect(debouncedRef.value).toBe('initial') // Still initial before timeout
    
    vi.advanceTimersByTime(50)
    await nextTick()
    expect(debouncedRef.value).toBe('second') // Only last value applied
  })
}) 