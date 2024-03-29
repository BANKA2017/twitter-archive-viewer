<template>
    <div id="following" class="my-5">
        <div class="grid grid-cols-4 gap-5 dark:text-white">
            <div class="col-span-4 md:col-span-1 ">
                <side-list/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <div v-if="Object.keys(state.followingPageData).length === 0 && !state.init" class="flex justify-center">
                    <loading-icon />
                </div>
                <div v-if="Object.keys(state.followingPageData).length === 0 && state.init" class="text-center text-2xl p-3 my-3 rounded-xl bg-gray-100 dark:bg-gray-900">
                    Empty
                </div>
                <div class="grid grid-cols-4 gap-5" v-for="accountData in state.followingPageData" :key="accountData.id_str">
                    <div class="dark:bg-gray-900 bg-gray-100 rounded-xl p-5 mb-3 col-span-4 lg:col-span-3">
                        <div class="flex flex-row">
                            <div class="basis-4/5">
                                <h5 class="font-bold text-lg">{{ accountData.display_name }}</h5>
                                <a :href="`https://twitter.com/`+accountData.name" target="_blank">@{{ accountData.name }}</a>
                            </div>
                            <div class="text-sm basis-1/5 lg:hidden">
                                <div class="inline-block mr-1 mb-1 text-sm border-2 border-sky-500 rounded-full max-w-[15em] w-full"><span class="bg-sky-500 px-2 rounded-full text-white">Following</span><span class="text-black dark:text-white px-2 w-full">{{ accountData.following }}</span></div>
                                <div class="inline-block mr-1 text-sm border-2 border-[#F91880] rounded-full max-w-[15em] w-full"><span class="bg-[#F91880] px-2 rounded-full text-white">Followers</span><span class="text-black dark:text-white px-2 w-full">{{ accountData.followers }}</span></div>
                            </div>
                        </div>

                        <div class="w-full">
                            <full-text :full_text_original="accountData.description_original || accountData.description_origin" :entities="accountData.entities"/>
                        </div>

                    </div>
                    <div class="stats stats-vertical bg-gray-100 dark:bg-gray-900 hidden lg:block lg:col-span-1 mb-3">
                        <div class="stat place-items-center">
                            <div class="stat-title">Followers</div>
                            <div class="stat-value">{{ accountData.followers }}</div>
                        </div>

                        <div class="stat place-items-center">
                            <div class="stat-title">Following</div>
                            <div class="stat-value">{{ accountData.following }}</div>
                        </div>
                    </div>
                </div>
                <div class="w-full text-center">
                    <pagination :pages-count="Math.ceil(Object.keys(state.followingList).length / 100)"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SideList from "~/components/SideList.vue";
import {onMounted, reactive} from "vue";
import {useMainStore} from "~/stores/main";
import {readFile, ScrollTo} from "~/share/Tools";
import Pagination from "~/components/Pagination.vue";
import LoadingIcon from "~/components/LoadingIcon.vue";

useHead({title: "Following"})

const state = reactive<{
    followingList: { [p in string]: any }
    followingPageData: { [p in string]: any },
    init: boolean
}>({
    followingList: {},
    followingPageData: {},
    init: false
})

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)
const globalHandle = computed(() => mainStore.globalHandle)
const page = computed(() => mainStore.page)

const router = useRouter()
if (!globalHandle.value) {
    router.push('/')
}

const filterFollowing = async () => {
    return Object.fromEntries(Object.entries(state.followingList || {}).slice(page.value * 100, page.value === -1 ? undefined : page.value * 100 + 100))
}

watch(page, async () => {
    ScrollTo(0)
    state.followingPageData = await filterFollowing()
})

onMounted(async () => {
    console.log(dataHandle.value.filter(x => x[0] === 'following.json'))
    const tmpFollowingFileHandle = dataHandle.value.filter(x => x[0] === 'following.json')[0]
    if (tmpFollowingFileHandle) {
        ScrollTo(0)
        state.followingList = JSON.parse((await readFile(tmpFollowingFileHandle[1])).content)
        console.log(state.followingList)
        state.followingPageData = await filterFollowing()
    }
    state.init = true
})

definePageMeta({
    layout: "archive-viewer",
})

</script>

<style scoped>

</style>