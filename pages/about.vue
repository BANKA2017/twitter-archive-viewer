<template>
    <div id="about" class="my-5">
        <div class="grid grid-cols-4 gap-5 dark:text-white">
            <div class="col-span-4 md:col-span-1 ">
                <side-list/>
            </div>
            <div class="col-span-4 md:col-span-3">
                <h5 class="text-3xl font-bold my-1">About Archive Viewer</h5>
                <p class="my-3">Twitter Archive Viewer is a complementary page to Archiver that allows offline reading of data
                    generated by <a href="https://github.com/BANKA2017/twitter-monitor/tree/node/apps/archiver" target="_blank" class="italic font-bold underline decoration-2 underline-offset-4 decoration-sky-500">Archiver()</a>.</p>
                <h5 class="text-3xl font-bold mb-1 mt-5">How to get archive files</h5>
                <p class="my-3">
                    <ul role="list" class="marker:text-sky-400 list-disc pl-5 space-y-1">
                        <li>Shared by twitter monitor official.</li>
                        <li>Generate it by yourself via <a href="https://github.com/BANKA2017/twitter-monitor/tree/node/apps/archiver" target="_blank" class="italic font-bold underline decoration-2 underline-offset-4 decoration-sky-500">Archiver()</a>.</li>
                    </ul>
                </p>
                <h5 class="text-3xl font-bold mb-1 mt-5">Create your own archive file <span class="italic underline underline-offset-4 decoration-double">and view it in this site</span></h5>
                <p >
                    <div class="border-yellow-500 border-l-4 px-2 mb-2" ><span class="font-bold">Notice:</span> Twitter's rate limit status will follow your account, once ran out of it you will unable to visit twitter until it was reset (30 mins). So we suggest you to open an incognito window to run the script below.</div>
                    <div class="border-yellow-500 border-l-4 px-2 mb-2" ><span class="font-bold">Notice2:</span> To know more issues or review the source code, please visit <a href="https://github.com/BANKA2017/twitter-monitor/tree/node/apps/archiver#known-issues" target="_blank" class="underline-offset-4 decoration-sky-500 underline">BANKA2017/twitter-monitor~/apps/archiver#known-issues</a> .</div>
                    <ul role="list" class="marker:text-sky-400 list-disc pl-5 space-y-1">
                        <li>Open <a href="https://twitter.com" class="underline-offset-4 decoration-sky-500 underline" target="_blank">twitter.com</a> in a new tab (Incognito window).</li>
                        <li>
                            Open the <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools" class="underline-offset-4 decoration-sky-500 underline" target="_blank">devtools</a> and set variables in console..
                            <code class="block select-all my-2 bg-gray-100 dark:bg-gray-900 px-5 py-3 rounded-xl">
                                window.name="twitter";<span class="text-green-500"> //Use the screen_name you want to replace "twitter"</span><br />
                                window.timelineFirst=true;<span class="text-green-500"> //Use the timeline api for the **second** crawl</span>
                            </code>
                        </li>
                        <li >Download the script named <a href="https://github.com/BANKA2017/twitter-monitor/actions/workflows/build_rollup.yml" class="underline-offset-4 decoration-sky-500 underline" target="_blank">archive_browser.js</a> <span class="font-bold">(Login required)</span> then paste it into the <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools" class="underline-offset-4 decoration-sky-500 underline" target="_blank">devtools'</a> console, then wait for the script to run to completion.</li>
                        <li >Go to <router-link to="/" class="underline-offset-4 decoration-sky-500 underline">Home</router-link> and upload the file you saved, enjoy it!</li>
                    </ul>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useMainStore} from "~/stores/main";
import SideList from "~/components/SideList.vue";

useHead({
    title: 'About'
})
const store = useMainStore()

definePageMeta({
    layout: "archive-viewer",
})
</script>
