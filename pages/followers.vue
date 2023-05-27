<template>
    <div id="followers" class="my-5">
        <div class="grid grid-cols-4 gap-5 dark:text-white">
            <div class="col-span-4 md:col-span-1 ">
                <side-list/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <div class="grid grid-cols-4 gap-5" v-for="accountData in state.followersPageData" :key="accountData.id_str">
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
                    <pagination :pages-count="Math.ceil(Object.keys(state.followersPageData).length / 100)"/>
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

useHead({title: "Followers"})

const state = reactive<{
    followersList: { [p in string]: any }
    followersPageData: { [p in string]: any }
}>({
    followersList: {},
    followersPageData: {}
})

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)
const globalHandle = computed(() => mainStore.globalHandle)
const page = computed(() => mainStore.page)

const router = useRouter()
if (!globalHandle.value) {
    router.push('/')
}

const filterFollowers = async () => {
    return Object.fromEntries(Object.entries(state.followersList || {}).slice(page.value * 100, page.value === -1 ? undefined : page.value * 100 + 100))
}

watch(page, async () => {
    ScrollTo(0)
    state.followersPageData = await filterFollowers()
})

onMounted(async () => {
    const tmpFollowersFileHandle = dataHandle.value.filter(x => x[0] === 'followers.json')[0]
    console.log(tmpFollowersFileHandle)
    if (tmpFollowersFileHandle) {
        ScrollTo(0)
        state.followersList = JSON.parse((await readFile(tmpFollowersFileHandle[1])).content)
        console.log(state.followersList)
        state.followersPageData = await filterFollowers()
    }
})

definePageMeta({
    layout: "archive-viewer",
})

</script>

<style scoped>

</style>