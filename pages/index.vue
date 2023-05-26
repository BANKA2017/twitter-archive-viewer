<template>
    <div id="main" class="my-5">
        <div class="grid grid-cols-4 gap-5 dark:text-white">
            <div class="col-span-4 md:col-span-1 ">
                <side-list/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <read-directory v-if="!globalHandle"/>
                <div v-else class="">
                    <div class="grid grid-cols-4 gap-5 mb-5">
                        <div class="rounded-xl dark:bg-gray-900 bg-gray-100 col-span-4 lg:col-span-3 min-h-[200px]">
                            <img v-if="existBanner" class="cursor-zoom-in rounded-t-xl" :src="state.info.banner" alt="banner" @click="OpenNewPage(state.info.banner)">
                            <div v-else class="rounded-t-xl h-[50%] bg-sky-500 dark:bg-sky-600 "></div>
                            <img class="cursor-zoom-in rounded-full w-[30%] sm:w-[16%] md:w-[20%] lg:w-[16%] -my-[15%] sm:-my-[8%] md:-my-[10%] lg:-my-[8%] mx-[2%]" :src="state.info.header" alt="avatar" @click="OpenNewPage(state.info.header)">
                            <div class="px-5 py-1 ml-[30%] sm:ml-[16%] md:ml-[20%] lg:ml-[16%]">
                                <h5 class="text-lg font-bold">{{ state.info.display_name }}</h5>
                                <a :href="`https://twitter.com/`+state.info.name" class="block hover:underline-offset-1 hover:underline " target="_blank">@{{ state.info.name }}</a>
                            </div>
                            <full-text v-if="state.info.description" :full_text_origin="state.info.description" :entities="state.info.entities" class="px-5 pb-5"/>
                        </div>
                        <div class="stats lg:stats-vertical shadow col-span-4 lg:col-span-1">
                            <div class="stat place-items-center">
                                <div class="stat-title">Followers</div>
                                <div class="stat-value">{{ state.info.followers }}</div>
                            </div>

                            <div class="stat place-items-center">
                                <div class="stat-title">Following</div>
                                <div class="stat-value">{{ state.info.following }}</div>
                            </div>

                            <div class="stat place-items-center">
                                <div class="stat-title">Tweets</div>
                                <div class="stat-value">{{ state.info.statuses_count }}</div>
                            </div>

                        </div>
                    </div>

                    <!--tweets-->
                    <div v-for="tweet in state.tweetsData" :key="tweet.tweet_id" class="grid grid-cols-4 gap-5 ">
                        <div class="col-span-4 lg:col-span-3 my-2">
                            <div class="p-5 bg-gray-100 dark:bg-gray-900 rounded-xl">
                                <div class="py-1 flex justify-between">
                                    <div class="">
                                        <a v-if="tweet.retweet_from_name" :href="`https://twitter.com/`+tweet.retweet_from_name" class="inline-block mr-1 px-2.5 text-sm rounded-full dark:bg-sky-600 bg-sky-500 text-ellipsis overflow-hidden max-w-[15em]">RT
                                            {{ tweet.retweet_from }}</a>
                                        <a v-else-if="tweet.conversation_id_str !== tweet.tweet_id" :href="`https://twitter.com/`+tweet.retweet_from_name" class="inline-block mr-1 px-2.5 text-sm rounded-full dark:bg-sky-600 bg-sky-500 text-ellipsis overflow-hidden max-w-[15em]">Reply</a>
                                        <a v-if="Object.keys(tweet.quoteObject).length" :href="`https://twitter.com/i/status/`+tweet.quoteObject.tweet_id" class="inline-block mr-1 px-2.5 text-sm rounded-full dark:bg-sky-600 bg-sky-500 text-ellipsis overflow-hidden max-w-[15em]">Quote</a>
                                        <span v-if="Object.keys(tweet.cardObject).length" class="inline-block mr-1 px-2.5 text-sm rounded-full dark:bg-sky-600 bg-sky-500 text-ellipsis overflow-hidden max-w-[15em]">Card</span>
                                    </div>
                                    <a :href="`https://twitter.com/i/status/`+tweet.conversation_id_str" class="hover:underline underline-offset-1 text-sm font-mono" target="_blank"><span class="font-bold mr-1">CONVERSATION</span>{{ tweet.conversation_id_str }}</a>
                                </div>
                                <div class="py-1 flex justify-between">
                                    <div class="">
                                        <!--TODO retweet-->
                                        <h5 class="inline-block text-lg font-bold">{{ tweet.display_name }}</h5>
                                        <a :href="`https://twitter.com/`+tweet.name" class="text-sm px-2 hover:underline-offset-1 hover:underline " target="_blank">@{{ tweet.name }}</a>
                                    </div>
                                    <a :href="`https://twitter.com/i/status/`+tweet.tweet_id" class="hover:underline underline-offset-1 text-sm font-mono" target="_blank"><span class="font-bold mr-1">ID</span>{{ tweet.tweet_id }}</a>
                                </div>

                                <full-text v-if="!/^https:\/\/t\.co\/\w+$/.test(tweet.full_text)" class="py-2" :entities="tweet.entities" :full_text_origin="tweet.full_text_origin"/>
                                <div v-if="tweet.mediaObject && tweet.mediaObject.some(x => x.source === 'tweets')">
                                    <tweet-image :list="tweet.mediaObject.filter(x => x.source === 'tweets')"/>
                                </div>
                                <div v-if="tweet.poll" class="rounded-xl dark:bg-gray-800 px-5 py-3 my-1">
                                    <div class="flex justify-between text-lg">
                                        <span class="font-bold">Poll label</span>
                                        <span class="font-bold">Count</span>
                                    </div>
                                    <div class="divider my-1"></div>
                                    <div v-for="(poll, index) in tweet.pollObject" :key="poll.choice_label" class="flex justify-between text-md ">
                                        <span class="font-bold">{{ poll.choice_label }}</span>
                                        <span>{{ poll.count }}</span>
                                    </div>
                                </div>
                                <!--quote-->
                                <div v-if="Object.keys(tweet.quoteObject).length" class="my-2 p-5 rounded-xl bg-gray-800">
                                    <div class="py-1 flex justify-between">
                                        <div class="">
                                            <!--TODO retweet-->
                                            <h5 class="inline-block text-lg font-bold">
                                                {{ tweet.quoteObject.display_name }}</h5>
                                            <a :href="`https://twitter.com/`+tweet.quoteObject.name" class="text-sm px-2 hover:underline-offset-1 hover:underline " target="_blank">@{{ tweet.quoteObject.name }}</a>
                                        </div>
                                        <a :href="`https://twitter.com/i/status/`+tweet.quoteObject.tweet_id" class="hover:underline underline-offset-1 text-sm font-mono" target="_blank"><span class="font-bold mr-1">ID</span>{{ tweet.quoteObject.tweet_id }}</a>
                                    </div>
                                    <full-text v-if="!/^https:\/\/t\.co\/\w+$/.test(tweet.quoteObject.full_text)" class="py-2" :entities="tweet.quoteObject.entities" :full_text_origin="tweet.quoteObject.full_text_origin"/>
                                    <div v-if="tweet.mediaObject && tweet.mediaObject.some(x => x.source === 'quote_status')">
                                        <tweet-image :list="tweet.mediaObject.filter(x => x.source === 'quote_status')"/>
                                    </div>
                                </div>
                                <p class="font-light dark:text-gray-300 text-gray-700 text-md">
                                    {{ (getDate(tweet.time * 1000)) }}</p>
                                <div class="mt-1" v-if="((tweet.retweet_count + tweet.quote_count + tweet.favorite_count) > 0)">
                                    <div class="flex justify-start">
                                        <span class="mr-4 text-gary-800 " v-if="tweet.retweet_count > 0"><retweet height="1.1rem" width="1.1rem" status="text-success mr-1 inline-block"/><span>{{ tweet.retweet_count }}</span></span>
                                        <span class="mr-4 text-gary-800 " v-if="tweet.reply_count > 0"><reply height="1.1rem" width="1.1rem" status="text-primary mr-1 inline-block"/><span>{{ tweet.reply_count }}</span></span>
                                        <span class="mr-4 text-gary-800 " v-if="tweet.favorite_count > 0"><like height="1.1rem" width="1.1rem" status="text-error mr-1 inline-block"/><span>{{ tweet.favorite_count }}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="grid grid-cols-4 gap-5">
                        <div class="w-full text-center col-span-4 lg:col-span-3">
                            <div class="btn-group my-3">
                                <button class="btn" @click="$router.push({query: {page: state.page-1}})">«</button>
                                <button class="btn">{{ state.page + Number(state.page >= 0) }}</button>
                                <button class="btn" @click="$router.push({query: {page: state.page+1}})">»</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SideList from "~/components/SideList.vue";
import ReadDirectory from "~/components/ReadDirectory.vue";
import {useMainStore} from "~/stores/main";
import {OpenNewPage, readFile, ScrollTo} from "~/share/Tools";
import {onMounted} from "vue";
import Retweet from "~/components/icons/Retweet.vue";
import Reply from "~/components/icons/Reply.vue";
import Like from "~/components/icons/Like.vue";
import {useRoute} from "vue-router";

useHead({title: "Archive"})

const state = reactive<{
    info: any
    tweets: { [p in string]: any }
    tweetsData: { [p in string]: any }
    page: number
}>({
    info: {},
    tweets: {},
    tweetsData: {},
    page: 0
})

const mainStore = useMainStore()
const globalHandle = computed(() => mainStore.globalHandle)
const dataHandle = computed(() => mainStore.dataHandle)

const existBanner = computed(() => state.info.banner && state.info.banner !== 'blob://')

const getDate = (timestamp: number = 0) => {
    const tmpDate = new Date(timestamp)
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Oct', 'Nov', 'Dec']
    //4:22 PM · 19 Aug, 2022
    return `${tmpDate.getHours()}:${(tmpDate.getMinutes()).toString().padStart(2, '0')} · ${tmpDate.getDate()} ${monthName[tmpDate.getMonth()]}, ${tmpDate.getFullYear()}`
}
const filterTweets = async () => {
    return Object.fromEntries(Object.entries(state.tweets || {}).slice(state.page * 20, state.page === -1 ? undefined : state.page * 20 + 20))
}
watch(dataHandle, async () => {
    const test_filter = dataHandle.value.filter(x => x[0] === 'data.json')
    if (test_filter.length === 1) {
        ScrollTo(0)
        let tmpData = JSON.parse((await readFile(test_filter[0][1])).content)
        tmpData.account_info.banner = `https://pbs.twimg.com/profile_banners/` + tmpData.account_info.uid_str + `/` + tmpData.account_info.banner
        tmpData.account_info.header = `https://` + tmpData.account_info.header
        state.info = tmpData.account_info
        state.tweets = tmpData.tweets
        state.tweetsData = await filterTweets()
    }
})

watch(() => state.page, async () => {
    ScrollTo(0)
    state.tweetsData = await filterTweets()
})

watch(() => state.info, async () => {
    //banner
    if (!state.info.banner.startsWith('blob://')) {
        const banner = dataHandle.value.filter(x => x[0].startsWith(`banner_${state.info.uid_str}`))[0]
        if (banner) {
            state.info.banner = URL.createObjectURL(banner[1])
        } else {
            state.info.banner = 'blob://'
        }
    }

    //avatar
    if (!state.info.header.startsWith('blob://')) {
        const avatar = dataHandle.value.filter(x => x[0].startsWith(`avatar_${state.info.uid_str}`))[0]
        if (avatar) {
            state.info.header = URL.createObjectURL(avatar[1])
        } else {
            state.info.header = 'blob://'
        }
    }

})

onMounted(async () => {
    const test_filter = dataHandle.value.filter(x => x[0] === 'data.json')
    if (test_filter.length === 1) {
        ScrollTo(0)
        let tmpData = JSON.parse((await readFile(test_filter[0][1])).content)
        tmpData.account_info.banner = `https://pbs.twimg.com/profile_banners/` + tmpData.account_info.uid_str + `/` + tmpData.account_info.banner
        tmpData.account_info.header = `https://` + tmpData.account_info.header
        state.info = tmpData.account_info
        state.tweets = tmpData.tweets
        state.tweetsData = await filterTweets()
    }
})

const route = useRoute()
if (route.query.page && !isNaN(Number(route.query.page))) {
    state.page = Number(route.query.page)
}
onBeforeRouteUpdate((to, from) => {
    if (to.query.page && !isNaN(Number(to.query.page))) {
        state.page = Number(to.query.page)
    }
})

definePageMeta({
    layout: "archive-viewer",
})

</script>

<style scoped lang="scss">
.cover-item {
    transition: all;
    transition-delay: 150ms;

    .dl {
        opacity: 0;
    }

    &:hover {
        .dl {
            opacity: 100%;
        }
    }
}
</style>