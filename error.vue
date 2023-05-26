<template>
  <div>
    <NuxtLayout name="archive-viewer">
      <div class="my-10">
        <h1 class="text-6xl mb-5 dark:text-white">{{ error.statusCode }}</h1>
        <p class="text-xl dark:text-sky-100">{{ errorMessage[error.statusCode] ? errorMessage[error.statusCode] : '？' }}, please return to the <NuxtLink to="/" class="underline hover:bg-black hover:text-white px-2 transition-color">homepage</NuxtLink>.</p>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {NuxtError} from "@nuxt/types"
useHead({title: 'Error'})
const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    default: ({statusCode: 404})
  }
})

const errorMessage = {
  302: 'Redirecting...',
  404: '😅Page not found',
  500: '😅Internal Server Error',
}

definePageMeta({
  layout: "archive-viewer",
})
</script>

<style scoped>

</style>