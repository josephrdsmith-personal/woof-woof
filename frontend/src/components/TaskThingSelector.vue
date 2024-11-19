<template>
  <div class="space-y-4">
    <!-- Add Thing to Task -->
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Add Things to Task</h3>
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search things..."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          @input="handleSearch"
        />
        <!-- Search Results -->
        <div 
          v-if="searchQuery && !loading && searchResults.length > 0" 
          data-testid="search-results"
          class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border"
        >
          <div v-for="thing in searchResults" :key="thing.id" class="p-2 hover:bg-gray-50 cursor-pointer"
            @click="handleAddThing(thing)">
            <div class="text-sm font-medium">{{ truncateContent(thing.content) }}</div>
            <div class="text-xs text-gray-500">{{ thing.type }}</div>
          </div>
        </div>
        <div v-if="loading" class="text-sm text-gray-500 mt-2">Loading...</div>
      </div>
    </div>

    <!-- Associated Things List -->
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Associated Things</h3>
      <div class="space-y-2">
        <div v-for="thing in associatedThings" :key="thing.id"
          class="flex justify-between items-center p-2 bg-gray-50 rounded">
          <div>
            <div class="text-sm font-medium">{{ truncateContent(thing.content) }}</div>
            <div class="text-xs text-gray-500">{{ thing.type }}</div>
          </div>
          <button
            @click="handleRemoveThing(thing)"
            class="text-red-500 hover:text-red-700"
            :disabled="loading"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        <div v-if="!associatedThings.length" class="text-sm text-gray-500 text-center py-2">
          No things associated with this task
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useTaskThingApi } from '../composables/useTaskThingApi'
import { useThingStore } from '../stores/thingStore'
import { useTaskThingStore } from '../stores/taskThingStore'
import type { Thing } from '../types/thing'
import { useDebouncedRef } from '../composables/useDebouncedRef'

const props = defineProps<{
  taskId: string
}>()

const { associateThingWithTask, removeThingFromTask, getThingsForTask, loading, error } = useTaskThingApi()
const thingStore = useThingStore()
const taskThingStore = useTaskThingStore()

const searchQuery = ref('')
const searchResults = ref<Thing[]>([])
const selectedTags = ref<string[]>([])

const associatedThings = computed(() => {
  const associations = taskThingStore.getThingsByTaskId(props.taskId)
  return associations.map(assoc => 
    thingStore.things.find((t: Thing) => t.id === assoc.thingId)
  ).filter((thing): thing is Thing => thing !== undefined)
})

const availableTags = computed(() => {
  const tagSet = new Set<string>()
  thingStore.things.forEach((thing: Thing) => {
    thing.tags.forEach((tag: string) => tagSet.add(tag))
  })
  return Array.from(tagSet)
})

const handleSearch = () => {
  if (!searchQuery.value.trim() && selectedTags.value.length === 0) {
    searchResults.value = []
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  const filteredThings = thingStore.things
    .filter((thing: Thing) => 
      !associatedThings.value.some(at => at.id === thing.id) &&
      (
        (searchQuery.value.trim() === '' || 
         thing.content.toLowerCase().includes(query) ||
         thing.tags.some((tag: string) => tag.toLowerCase().includes(query))
        ) &&
        (selectedTags.value.length === 0 ||
         selectedTags.value.every(tag => thing.tags.includes(tag)))
      )
    )
  
  searchResults.value = filteredThings
}

const handleAddThing = async (thing: Thing) => {
  try {
    const taskThing = await associateThingWithTask({
      taskId: props.taskId,
      thingId: thing.id
    })
    taskThingStore.addTaskThing(taskThing)
    searchQuery.value = ''
    searchResults.value = []
  } catch (e) {
    // Error handled by useTaskThingApi
  }
}

const handleRemoveThing = async (thing: Thing) => {
  try {
    await removeThingFromTask(props.taskId, thing.id)
    taskThingStore.removeTaskThing(props.taskId, thing.id)
  } catch (e) {
    // Error handled by useTaskThingApi
  }
}

const truncateContent = (content: string) => {
  return content.length > 50 ? content.slice(0, 47) + '...' : content
}

const handleTagClick = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
  handleSearch()
}

// Add debounced search
const debouncedSearch = useDebouncedRef(searchQuery, 300)
watch(debouncedSearch, handleSearch)

// Load initial associations
onMounted(async () => {
  try {
    const associations = await getThingsForTask(props.taskId)
    associations.forEach(assoc => taskThingStore.addTaskThing(assoc))
  } catch (e) {
    // Error handled by useTaskThingApi
  }
})
</script> 