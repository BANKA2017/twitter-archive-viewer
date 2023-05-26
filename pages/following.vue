<template>
    <div id="following" class="my-5">
        <div class="grid grid-cols-4 gap-5 dark:text-white">
            <div class="col-span-4 md:col-span-1 ">
                <side-list/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <div class="grid grid-cols-4 gap-5" v-for="accountData in state.followingPageData" :key="accountData.id_str">
                    <div class="dark:bg-gray-900 bg-gray-100 rounded-xl p-5 mb-3 col-span-4 lg:col-span-3">
                        <div class="flex flex-row">
                            <div class="basis-4/5">
                                <h5 class="font-bold text-lg">{{ accountData.display_name }}</h5>
                                <a :href="`https://twitter.com/`+accountData.name" target="_blank">@{{ accountData.name }}</a>
                            </div>
                            <div class="text-sm basis-1/5 lg:hidden">
                                <div class="rounded-full px-2 py-0.5 mx-1 my-1 bg-sky-500 dark:bg-sky-700">Following:
                                    {{ accountData.following }}
                                </div>
                                <div class="rounded-full px-2 py-0.5 mx-1 my-1 bg-sky-500 dark:bg-sky-700">Followers:
                                    {{ accountData.followers }}
                                </div>
                            </div>
                        </div>

                        <div class="w-full">
                            <full-text :full_text_origin="accountData.description_origin" :entities="accountData.entities"/>
                        </div>

                    </div>
                    <div class="stats stats-vertical shadow hidden lg:block lg:col-span-1 mb-3">
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
                    <div class="btn-group my-3">
                        <button class="btn" @click="state.page--">«</button>
                        <button class="btn">{{ state.page + Number(state.page >= 0) }}</button>
                        <button class="btn" @click="state.page++">»</button>
                    </div>
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

useHead({title: "Following"})

const state = reactive<{
    page: number
    followingList: { [p in string]: any }
    followingPageData: { [p in string]: any }
}>({
    page: 0,
    followingList: {},
    followingPageData: {}
})

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)
const globalHandle = computed(() => mainStore.globalHandle)

const router = useRouter()
if (!globalHandle.value) {
    router.push('/')
}

const filterFollowing = async () => {
    return Object.fromEntries(Object.entries(state.followingList || {}).slice(state.page * 100, state.page === -1 ? undefined : state.page * 100 + 100))
}

watch(() => state.page, async () => {
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
})

definePageMeta({
    layout: "archive-viewer",
})

</script>

<style scoped>

</style>