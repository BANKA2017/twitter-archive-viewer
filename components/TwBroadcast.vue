<template>
    <div id="broadcast">
        <video v-if="state.broadcastUrl"
               :class="{'w-full': true, 'aspect-video': true, 'object-cover': true, 'h-[100%]': true, 'rounded-xl': true, }"
               :src="state.broadcastUrl" controls preload="metadata"/>
        <div v-else class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">Local video is <span class="font-bold">NOT</span> available, please watch <a :href="'https://twitter.com/i/broadcasts/' + broadcastObject.id" target="_blank" class="underline-offset-2 underline text-sky-500">online</a> </div>
        <div class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            {{broadcastObject.title}}
        </div>
    </div>
</template>

<script setup lang="ts">

    import {PropType} from "vue";
    import {LiveVideoContent} from "~/type/Content";
    import {useMainStore} from "~/stores/main";

    const props = defineProps({
        broadcastObject: {
            type: Object as PropType<LiveVideoContent>,
            default: {}
        },
    })

    const mainStore = useMainStore()
    const dataHandle = computed(() => mainStore.dataHandle)

    const state = reactive<{
        broadcastUrl: string
    }>({
        broadcastUrl: '',
    })

    onMounted(async () => {
        const file = dataHandle.value.filter(x => x[0] === `broadcast_${props.broadcastObject.id}.mp4`)[0]
        if (file) {
            state.broadcastUrl = URL.createObjectURL(file[1].getFile ? await file[1].getFile() : file[1])
        }
    })
</script>

<style scoped>

</style>