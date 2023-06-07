<template>
    <div id="broadcast">
        <div v-if="state.audiospaceUrl">
            <audio class="w-full" :src="state.audiospaceUrl" controls />
        </div>
        <div v-else class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">Local audio is <span class="font-bold">NOT</span> available, please listen <a :href="'https://twitter.com/i/spaces/' + audiospaceObject.id" target="_blank" class="underline-offset-2 underline text-sky-500">online</a> </div>
        <div class="rounded-xl w-full p-3 bg-gray-200 dark:bg-gray-800 my-2">
            {{audiospaceObject.title}}
        </div>
    </div>
</template>

<script setup lang="ts">

    import {PropType} from "vue";
    import {AudioSpace} from "~/type/Content";
    import {useMainStore} from "~/stores/main";

    const props = defineProps({
        audiospaceObject: {
            type: Object as PropType<AudioSpace>,
            default: {}
        },
    })

    const mainStore = useMainStore()
    const dataHandle = computed(() => mainStore.dataHandle)

    const state = reactive<{
        audiospaceUrl: string
    }>({
        audiospaceUrl: '',
    })

    onMounted(async () => {
        const file = dataHandle.value.filter(x => x[0] === `audiospace_${props.audiospaceObject.id}.aac`)[0]
        if (file) {
            state.audiospaceUrl = URL.createObjectURL(file[1].getFile ? await file[1].getFile() : file[1])
        }
    })
</script>

<style scoped>

</style>