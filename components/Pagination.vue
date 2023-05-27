<template>
    <div id="pagination">
        <div class="btn-group my-3">
            <button class="btn" @click="$router.push({query: {page: page-1}})">«</button>
            <div class="btn dropdown dropdown-top">
                <label tabindex="0" class="btn m-1">{{ page + Number(page >= 0) }}</label>
                <div tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 overflow-y-scroll max-h-[500px]">
                    <ul class="w-full">
                        <li v-for="(_, toPage) in new Array(pagesCount)" :key="toPage"><router-link :to="{query: {page: toPage}}">{{ toPage + 1 }}</router-link></li>
                    </ul>
                </div>
            </div>
            <button class="btn" @click="$router.push({query: {page: page+1}})">»</button>
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