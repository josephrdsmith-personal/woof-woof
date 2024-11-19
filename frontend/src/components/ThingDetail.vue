<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-4 sm:p-6">
      <!-- Thing Content -->
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span class="capitalize">{{ thing.type }}</span>
            <span>•</span>
            <span>{{ formatDate(thing.createdAt) }}</span>
          </div>
          <div class="mt-2">
            <p v-if="thing.type === 'text'" class="text-gray-900">{{ thing.content }}</p>
            <img v-else-if="thing.type === 'image'" :src="thing.content" :alt="thing.content" class="max-w-full rounded" />
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="handleStar"
            class="flex items-center space-x-1 text-gray-400 hover:text-yellow-500"
          >
            <StarIcon :class="{ 'text-yellow-500': thing.stars > 0 }" class="h-5 w-5" />
            <span>{{ thing.stars }}</span>
          </button>
          <button
            @click="handleCopy"
            class="text-gray-400 hover:text-indigo-600"
            title="Copy Thing"
          >
            <DocumentDuplicateIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in thing.tags"
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Comments Section -->
      <div class="mt-6">
        <h3 class="text-lg font-medium text-gray-900">Comments</h3>
        <div class="mt-2 space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-900">{{ comment.content }}</p>
            <p class="mt-1 text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</p>
          </div>
        </div>

        <!-- Add Comment Form -->
        <form @submit.prevent="handleAddComment" class="mt-4">
          <div>
            <label for="comment" class="sr-only">Add a comment</label>
            <textarea
              id="comment"
              v-model="newComment"
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Add a comment..."
            ></textarea>
          </div>
          <div class="mt-2 flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ loading ? 'Adding...' : 'Add Comment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { StarIcon, DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import { useThingApi } from '../composables/useThingApi'
import { useThingStore } from '../stores/thingStore'
import type { Thing } from '../types/thing'
import type { Comment } from '../types/comment'

const props = defineProps<{
  thing: Thing
}>()

const { starThing, copyThing, addComment, loading } = useThingApi()
const thingStore = useThingStore()
const newComment = ref('')

const comments = computed(() => thingStore.getThingComments(props.thing.id))

const handleStar = async () => {
  try {
    const updatedThing = await starThing(props.thing.id)
    thingStore.updateThing(updatedThing)
  } catch (e) {
    // Error handled by useThingApi
  }
}

const handleCopy = async () => {
  try {
    const newThing = await copyThing(props.thing.id)
    thingStore.addThing(newThing)
  } catch (e) {
    // Error handled by useThingApi
  }
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const comment = await addComment(props.thing.id, newComment.value)
    thingStore.addComment(props.thing.id, comment)
    newComment.value = ''
  } catch (e) {
    // Error handled by useThingApi
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}
</script> 