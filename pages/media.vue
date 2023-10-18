<template>
    <div id="media" class="my-5">
        <div class="grid grid-cols-4 gap-5 dark:text-white">
            <div class="col-span-4 md:col-span-1 ">
                <side-list/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <div v-if="Object.keys(state.mediaList).length === 0" class="flex justify-center">
                    <loading-icon />
                 </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <div :class="{'cursor-pointer': true, 'bg-slate-300': true, 'aspect-video': true, 'border-2': true, 'border-white': true, 'dark:border-black': true, 'hover:border-sky-700': true, 'dark:bg-slate-700': true, 'dark:hover:border-sky-300': true, 'select-none': true, 'col-span-1': true}" v-for="mediaData in state.mediaList" :key="mediaData.fileInfo.basename">
                        <div class="relative w-full aspect-video cover-item group/cover">
                            <div :class="{'absolute': true, 'top-2': true, 'right-2': true, 'px-1': true, 'text-sm': true, 'text-white': true, 'bg-sky-500': true }" v-if="!mediaData.fileInfo.content_type.startsWith('image')">
                                VIDEO
                            </div>
                            <!--<a :href="mediaPath + meta.url + ((meta.original_type || meta.origin_type) === 'photo' ? ':orig' : '')" :class="{absolute: true, 'bottom-2': true, 'right-2': true, 'px-1': true, 'bg-sky-500': true, 'text-sm': true, 'text-white': true, 'w-8': true, 'h-8': true, 'transition-all': true, 'duration-150': true, 'dl': true}" target="_blank" @click="e => {e.stopPropagation()}" v-if="!selectedMode">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                </svg>
                            </a>-->
                            <img v-if="mediaData.fileInfo.content_type.startsWith('image')" :src="mediaData.blob" :alt="mediaData.fileInfo.basename" class="w-full aspect-video object-scale-down" loading="lazy" @click="OpenNewPage(mediaData.blob)"/>
                            <video v-else class="w-full aspect-video object-scale-down" controls preload="metadata" :src="mediaData.blob"/>
                        </div>
                    </div>
                </div>
                <div class="w-full text-center">
                    <pagination :pages-count="Math.ceil(state.mediaFile.length / 100)"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useMainStore} from "~/stores/main";
import {onMounted, reactive} from "vue";
import {OpenNewPage, readFile, ScrollTo} from "~/share/Tools";
import SideList from "~/components/SideList.vue";
import {OnlineMedia} from "~/type/Content";
import Pagination from "~/components/Pagination.vue";
import LoadingIcon from "~/components/LoadingIcon.vue";

useHead({title: "Media"})

const state = reactive<{
    mediaFile: OnlineMedia[]
    mediaList: { blob: string; fileInfo: OnlineMedia; }[]
}>({
    mediaFile: [],
    mediaList: []
})

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)
const globalHandle = computed(() => mainStore.globalHandle)
const page = computed(() => mainStore.page)
const flexibleMode = computed(() => mainStore.flexible)

const router = useRouter()
if (!globalHandle.value) {
    router.push('/')
}

const filterMedia = async (): Promise<{ blob: string; fileInfo: OnlineMedia; }[]> => {
    const tmpList = state.mediaFile.slice(page.value * 100, page.value === -1 ? undefined : page.value * 100 + 100)

    const tmpBlob = []
    for (const media of tmpList) {
        if (flexibleMode.value > 0) {
            tmpBlob.push({
                blob: media.url,
                fileInfo: media
            })
        } else {
            const file = dataHandle.value.filter(x => x[0] === media.basename)[0]
            if (file) {
                tmpBlob.push({
                    blob: URL.createObjectURL(new Blob([file[1].getFile ? await file[1].getFile() : (file[1].getData ? (await readFile(file[1], 'blob')).content : file[1])], {type: media.content_type})),
                    fileInfo: media
                })
            }
        }
    }

    return tmpBlob
}

watch(page, async () => {
    ScrollTo(0)
    state.mediaList = await filterMedia()
})

onMounted(async () => {
    const tmpMediaFileHandle = dataHandle.value.filter(x => x[0] === 'media.json')[0]
    console.log(tmpMediaFileHandle)
    if (tmpMediaFileHandle) {
        ScrollTo(0)
        state.mediaFile = [...new Set((JSON.parse((await readFile(tmpMediaFileHandle[1])).content) || []).filter(media => media.source === 'tweets' || media.source === 'quote_status'))]
        console.log(state.mediafile)
        state.mediaList = await filterMedia()
    }
})

definePageMeta({
    layout: "archive-viewer",
})
</script>

<style scoped>

</style>