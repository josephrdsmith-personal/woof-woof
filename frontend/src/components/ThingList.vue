<template>
  <div class="space-y-4">
    <div v-for="thing in things" :key="thing.id" class="bg-white shadow rounded-lg p-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-900">
            <button @click="$emit('select', thing)" class="hover:text-indigo-600">
              {{ truncateContent(thing.content) }}
            </button>
          </h3>
          <div class="mt-1 flex items-center space-x-2 text-sm text-gray-500">
            <span>{{ thing.type }}</span>
            <span>•</span>
            <span>{{ formatDate(thing.createdAt) }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="handleStar(thing)"
            class="flex items-center space-x-1 text-gray-400 hover:text-yellow-500"
          >
            <StarIcon :class="{ 'text-yellow-500': thing.stars > 0 }" class="h-5 w-5" />
            <span>{{ thing.stars }}</span>
          </button>
          <button
            @click="handleCopy(thing)"
            class="text-gray-400 hover:text-indigo-600"
          >
            <DocumentDuplicateIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="tag in thing.tags"
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon, DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import { useThingApi } from '../composables/useThingApi'
import { useThingStore } from '../stores/thingStore'
import type { Thing } from '../types/thing'

const props = defineProps<{
  things: Thing[]
}>()

const emit = defineEmits<{
  (e: 'select', thing: Thing): void
}>()

const { starThing, copyThing } = useThingApi()
const thingStore = useThingStore()

const handleStar = async (thing: Thing) => {
  try {
    const updatedThing = await starThing(thing.id)
    thingStore.updateThing(updatedThing)
  } catch (e) {
    // Error handled by useThingApi
  }
}

const handleCopy = async (thing: Thing) => {
  try {
    const newThing = await copyThing(thing.id)
    thingStore.addThing(newThing)
  } catch (e) {
    // Error handled by useThingApi
  }
}

const truncateContent = (content: string) => {
  return content.length > 100 ? content.slice(0, 97) + '...' : content
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}
</script> 