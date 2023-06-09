<template>
    <div id="tweet-image">
        <div
            :class="{grid: true, 'grid-cols-2': true, 'aspect-video': (state.realList.length > 1 && !state.fullMedia), 'gap-0.5': true, 'rounded-xl': true, }">
            <div v-for="(media, index) in state.realList" :key="media.basename"
                 :class="{'overflow-hidden': true, 'col-span-2': state.realList.length === 1, 'row-start-1': (state.realList.length === 2 || (state.realList.length === 3 && index === 0)), 'row-end-3': (state.realList.length === 2 || (state.realList.length === 3 && index === 0)), }">
                <video v-if="media.content_type.startsWith('video')"
                       :class="{'w-full': true, 'aspect-video': state.realList.length >= 3 && index !== 0 && !state.fullMedia, 'object-cover': true, 'h-[100%]': true, 'rounded-xl': true, }"
                       :src="media.url" controls preload="metadata"/>
                <img v-else :alt="media.basename" :class="{'cursor-zoom-in': true, 'w-full': true, 'aspect-video': state.realList.length >= 3 && index !== 0 && !state.fullMedia, 'object-cover': true, 'h-[100%]': true, 'rounded-xl': true, }"
                     :src="media.url"
                     @click="OpenNewPage(media.url)"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {OnlineMedia} from "~/type/Content";
import {onMounted, PropType} from "vue";
import {useMainStore} from "~/stores/main";
import {OpenNewPage, readFile} from "~/share/Tools";

const props = defineProps({
    mediaStatus: {
        type: Boolean,
        default: false
    },
    list: {
        type: Array as PropType<OnlineMedia[]>,
        default: () => []
    },
    aspect_ratio: {
        type: String,
        default: 'auto'
    },
})

const state = reactive<{
    realList: any[]
    fullMedia: boolean
}>({
    realList: [],
    fullMedia: false
})

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)

onMounted(async () => {
    let tmpNameList: string[] = []
    let tmpList: any[] = []
    props.list?.forEach(x => {
        if (!tmpNameList.includes(x.filename)) {
            tmpNameList.push(x.filename)
            tmpList.push(x)
        }
    })
    const tmpRealList = []
    for (const media of tmpList) {
        const file = dataHandle.value.filter(x => x[0] === media.basename)[0]
        if (file) {
            media.url = URL.createObjectURL(file[1].getFile ? await file[1].getFile() : (file[1].getData ? (await readFile(file[1], 'blob')).content : file[1]))
            tmpRealList.push(media)
        }
    }
    state.realList = tmpRealList
})

</script>

<style scoped>

</style>