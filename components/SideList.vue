<script lang="ts" setup>
import {reactive} from "vue";
import {useMainStore} from "~/stores/main";

const nameList = ['media.json', 'following.json', 'followers.json']

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)

const state = reactive<{
    navs: any[]
}>({
    navs: [
        {name: 'Tweets', to: '/', routerName: 'index', active: true,},
        {name: 'Media', to: '/media', routerName: 'media', active: false,},
        {name: 'Following', to: '/following', routerName: 'following', active: false,},
        {name: 'Followers', to: '/followers', routerName: 'followers', active: false,},
        //{name: 'Explorer', to: '/explorer', routerName: 'explorer', active: true, },
        {name: 'About', to: '/about', routerName: 'about', active: true,},
    ]
})
watch(dataHandle, () => {
    for (const index in nameList) {
        state.navs[Number(index) + 1].active = dataHandle.value.some(fileHandle => fileHandle[0] === nameList[index])
    }
})
for (const index in nameList) {
    state.navs[Number(index) + 1].active = dataHandle.value.some(fileHandle => fileHandle[0] === nameList[index])
}
</script>

<template>
    <div id="side-list" class="select-none">
        <template v-for="nav in state.navs.filter(x => x.active)" :key="nav.name">
            <router-link :class="{'inline-block': true, 'md:block': true, 'my-1': true, 'px-3': true, 'mx-1': true, 'rounded-full': true, 'text-center': true, 'text-2xl': true, 'font-bold': true, 'transition-colors': true, 'hover:bg-sky-500': true, 'bg-sky-500': $route.name === nav.routerName, 'text-black': $route.name !== nav.routerName, 'hover:text-white': true, 'dark:text-white': true, 'text-white': $route.name === nav.routerName, 'py-2': true, }"
                         :to="nav.to">
                {{ nav.name }}
            </router-link>
        </template>

        <div class="text-sm text-gray-500 text-center my-5 hidden md:block">A Twitter Monitor Project</div>
    </div>
</template>

<style scoped>

</style>