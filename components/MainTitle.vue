<template>
    <div class="mt-4">
        <div class="flex items-center">
            <div class="text-4xl py-1 font-bold bg-clip-text grow">
                <router-link class="inline-block mr-2 text-black dark:text-white" to="/">Archive</router-link>
                <span
                    :class="{'select-none': true, 'text-white': true, 'px-2': true, 'rounded-2xl': true, 'text-sm': true, 'bg-sky-500': true}">test</span>
            </div>
            <button v-if="globalHandle"
                    class="flex-none rounded-md bg-slate-100 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-sky-900 text-black dark:text-white border-sky-500 transition-colors px-3 py-2 mr-2"
                    @click="cleanAll">CLEAN
            </button>
            <dark-button class="flex-none" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useMainStore} from "../stores/main";
import {useRouter} from "vue-router";

const mainStore = useMainStore()
const globalHandle = computed(() => mainStore.globalHandle)

const router = useRouter()

const cleanAll = () => {
    mainStore.updateCoreValue('globalHandle', null)
    mainStore.updateCoreValue('dataHandle', [])
    router.push('/')
}

</script>