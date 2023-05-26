<template>
    <svg :class="status" :height="height" :width="width" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" fill-rule="evenodd"/>
    </svg>
</template>

<script lang="ts" setup>

defineProps({
    status: String,
    width: String,
    height: String
})
</script>

<style scoped>

</style>