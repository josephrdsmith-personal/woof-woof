import { createTestingPinia } from '@pinia/testing'
import type { Thing } from '../../types/thing'
import type { TaskThing } from '../../types/taskThing'

export const createTestPinia = (initialState?: {
  thing?: { things: Thing[] },
  taskThing?: { taskThings: TaskThing[] }
}) => {
  return createTestingPinia({
    createSpy: vi.fn,
    initialState: {
      thing: { things: [] },
      taskThing: { taskThings: [] },
      ...initialState
    }
  })
} 