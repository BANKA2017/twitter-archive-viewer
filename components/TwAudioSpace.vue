<template>
    <div id="audiospace">
        <div v-if="state.audiospaceUrl">
            <audio class="w-full" :src="state.audiospaceUrl" controls />
        </div>
        <div v-else-if="state.exist" class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            Loading...
        </div>
        <div v-else class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            <span v-if="flexibleMode">Flexible mode is <span class="font-bold">NOT</span> yet support m3u8 player, please listen </span>
            <span v-else>Local audio is <span class="font-bold">NOT</span> available, please listen </span>
            <a :href="'https://twitter.com/i/spaces/' + cardObject.url" target="_blank" class="underline-offset-2 underline text-sky-500">online</a>
        </div>
        <div v-if="audiospaceObject.title" class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            {{audiospaceObject.title}}
        </div>
    </div>
</template>

<script setup lang="ts">

    import {PropType} from "vue";
    import {AudioSpace, Card} from "~/type/Content";
    import {useMainStore} from "~/stores/main";
    import {readFile} from "~/share/Tools";

    const props = defineProps({
        cardObject: {
            type: Object as PropType<Card>,
            default: {}
        },
        audiospaceObject: {
            type: Object as PropType<AudioSpace>,
            default: {}
        },
    })

    const mainStore = useMainStore()
    const dataHandle = computed(() => mainStore.dataHandle)
    const flexibleMode = computed(() => mainStore.flexible)

    const state = reactive<{
        audiospaceUrl: string
        exist: boolean
    }>({
        audiospaceUrl: '',
        exist: false
    })

    onMounted(async () => {
        if (flexibleMode.value > 0) {return}
        const file = dataHandle.value.filter(x => x[0] === `audiospace_${props.audiospaceObject.id}.aac`)[0]
        if (file) {
            state.exist = true
            state.audiospaceUrl = URL.createObjectURL(new Blob([file[1].getFile ? await file[1].getFile() : (file[1].getData ? (await readFile(file[1], 'blob')).content : file[1])], {type: 'audio/aac'}))
        }
    })
</script>

<style scoped>

</style>