<template>
    <div id="pagination">
        <div class="btn-group my-3">
            <button class="btn bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:text-white border-0" @click="() => {if (pagesCount > -(page)) {$router.push({query: {page: page-1}})}}">«</button>
            <div class="btn dropdown dropdown-top bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:text-white border-0" tabindex="0" >
                <div class="p-4">{{ page + Number(page >= 0) }}</div>
                <div tabindex="0" class="dropdown-content menu p-2 shadow bg-gray-200 dark:bg-gray-700 rounded-box w-52 overflow-y-scroll max-h-[500px]">
                    <ul class="w-full text-black dark:text-white">
                        <li v-for="(_, toPage) in new Array(pagesCount)" :key="toPage"><router-link :to="{query: {page: toPage}}">{{ toPage + 1 }}</router-link></li>
                    </ul>
                </div>
            </div>
            <button class="btn bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:text-white border-0" @click="() => {if (pagesCount > page + 1) {$router.push({query: {page: page+1}})}}">»</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useMainStore} from "~/stores/main";

const props = defineProps({
    pagesCount: {
        type: Number,
        default: 1
    }
})

const mainStore = useMainStore()
const page = computed(() => mainStore.page)

</script>

<style scoped>

</style>