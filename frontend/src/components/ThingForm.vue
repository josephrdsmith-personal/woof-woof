<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
      <select
        id="type"
        v-model="type"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div>
      <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
      <textarea
        id="content"
        v-model="content"
        rows="4"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div>
      <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
      <input
        id="tags"
        v-model="tagsInput"
        placeholder="Enter tags separated by commas"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span v-if="loading">Creating...</span>
      <span v-else>Create Thing</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThingApi } from '../composables/useThingApi'
import { useThingStore } from '../stores/thingStore'
import type { ThingType } from '../types/thing'

const type = ref<ThingType>('text')
const content = ref('')
const tagsInput = ref('')
const { createThing, loading, error } = useThingApi()
const thingStore = useThingStore()

const tags = computed(() => 
  tagsInput.value.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
)

const handleSubmit = async () => {
  try {
    const thing = await createThing({
      type: type.value,
      content: content.value,
      tags: tags.value
    })
    thingStore.addThing(thing)
    // Reset form
    type.value = 'text'
    content.value = ''
    tagsInput.value = ''
  } catch (e) {
    // Error is handled by useThingApi
  }
}
</script> 