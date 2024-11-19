import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Thing, Comment } from '../types/thing'

export const useThingStore = defineStore('thing', () => {
  const things = ref<Thing[]>([])
  const comments = ref<Record<string, Comment[]>>({})

  function addThing(thing: Thing): void {
    things.value.push(thing)
    comments.value[thing.id] = []
  }

  function updateThing(updatedThing: Thing): void {
    const index = things.value.findIndex(t => t.id === updatedThing.id)
    if (index !== -1) {
      things.value[index] = updatedThing
    }
  }

  function getThingComments(thingId: string): Comment[] {
    return comments.value[thingId] || []
  }

  function addComment(thingId: string, comment: Comment): void {
    if (!comments.value[thingId]) {
      comments.value[thingId] = []
    }
    comments.value[thingId].push(comment)
  }

  return {
    things,
    addThing,
    updateThing,
    getThingComments,
    addComment
  }
})

export type ThingStore = ReturnType<typeof useThingStore> 