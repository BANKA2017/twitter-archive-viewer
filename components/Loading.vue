<template>
    <div v-if="state.loading" class="fixed right-3 top-5">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-400 dark:text-white" fill="none"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"></path>
        </svg>
    </div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue"
import {onBeforeRouteLeave} from "vue-router"

const state = reactive<{
    loading: boolean
}>({
    loading: true
})

onMounted(() => {
    state.loading = false
})
onBeforeRouteLeave(() => {
    state.loading = true
})

</script>

<style scoped>

</style>