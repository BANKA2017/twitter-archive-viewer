<template>
    <div id="broadcast">
        <video v-if="state.broadcastUrl"
               :class="{'w-full': true, 'aspect-video': true, 'object-cover': true, 'h-[100%]': true, 'rounded-xl': true, }"
               :src="state.broadcastUrl" controls preload="metadata"/>
        <div v-else-if="state.exist" class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            Loading...
        </div>
        <div v-else class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            <span v-if="flexibleMode">Flexible mode is <span class="font-bold">NOT</span> yet support m3u8 player, please watch </span>
            <span v-else>Local video is <span class="font-bold">NOT</span> available, please watch </span>
            <a :href="cardObject.url" target="_blank" class="underline-offset-2 underline text-sky-500">online</a>
        </div>
        <div v-if="broadcastObject.title" class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            {{broadcastObject.title}}
        </div>
    </div>
</template>

<script setup lang="ts">

    import {PropType} from "vue";
    import {Card, LiveVideoContent} from "~/type/Content";
    import {useMainStore} from "~/stores/main";
    import {readFile} from "~/share/Tools";

    const props = defineProps({
        cardObject: {
            type: Object as PropType<Card>,
            default: {}
        },
        broadcastObject: {
            type: Object as PropType<LiveVideoContent>,
            default: {}
        },
    })

    const mainStore = useMainStore()
    const dataHandle = computed(() => mainStore.dataHandle)
    const flexibleMode = computed(() => mainStore.flexible)

    const state = reactive<{
        broadcastUrl: string
        exist: boolean
    }>({
        broadcastUrl: '',
        exist: false
    })

    onMounted(async () => {
        if (flexibleMode.value > 0) {return}
        const file = dataHandle.value.filter(x => x[0] === `broadcast_${props.broadcastObject.id}.mp4`)[0]
        if (file) {
            state.exist = true
            state.broadcastUrl = URL.createObjectURL(new Blob([file[1].getFile ? await file[1].getFile() : (file[1].getData ? (await readFile(file[1], 'blob')).content : file[1])], {type: 'video/mp4'}))
        }
    })
</script>

<style scoped>

</style>