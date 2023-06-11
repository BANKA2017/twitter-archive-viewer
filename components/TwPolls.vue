<template>
    <div id="twPolls" class="my-2">
        <div class="w-full" >
            <div v-for="(poll, index) in polls" :key="poll.poll_order" class="progress">
                <div
                    :style="{'background-color': maxPollIndex === index ? '#7CC5F6' : '#CFD9DE',  width: Math.ceil((poll.count/pollCount)*100) + '%'}"
                    class="progress-bar"></div>
                <div class="progress-data">
                    <span :class="{'font-bold': maxPollIndex === index, 'font-medium': maxPollIndex !== index}">{{
                            poll.choice_label
                        }}</span>
                    <span :class="{'font-bold': maxPollIndex === index, 'font-medium': maxPollIndex !== index}">{{
                            Math.ceil((poll.count / pollCount) * 100) + '%'
                        }}</span>
                </div>
            </div>
        </div>
        <template>
            <div v-for="poll in polls" :key="poll.poll_order" class="btn-block mx-auto mb-1" @click="e => {e.stopPropagation()}">{{ poll.choice_label }}</div>
        </template>
        <div class="rounded-xl bg-gray-200 dark:bg-gray-800 px-5 py-3 my-1">
            <div class="flex justify-between text-lg">
                <span class="font-bold">Poll label</span>
                <span class="font-bold">Count</span>
            </div>
            <div class="divider my-1"></div>
            <div v-for="(poll, index) in polls" :key="poll.choice_label" class="flex justify-between text-md ">
                <span class="font-bold">{{ poll.choice_label }}</span>
                <span>{{ poll.count }}</span>
            </div>
        </div>
        <!--TODO end time-->
    </div>
</template>

<script lang="ts" setup>
import {computed, PropType} from "vue";
import {PollItem} from "~/type/Content";

const props = defineProps({
    tweetId: {
        type: String,
        default: 0
    },
    polls: {
        type: Array as PropType<PollItem[]>,
        default: []
    }
})

const pollCount = computed(() => props.polls.map(x => x.count).reduce((a, b) => a + b, 0))
const maxPollIndex = computed(() => {
    let tmpMaxIndex = -1
    let tmpPolls = props.polls.map(poll => poll.count)
    tmpPolls.forEach((count, index) => {
        if (tmpMaxIndex === -1 || tmpPolls[tmpMaxIndex] < count) {
            tmpMaxIndex = index
        }
    })
    return tmpMaxIndex
})

</script>

<style lang="scss" scoped>
.progress {
    height: 2em;
    font-size: 1em;
    border-radius: 0.375em;
    position: relative;
    width: 100%;
    margin-bottom: 0.375em;

    & > .progress-data {
        position: absolute;
        padding: 0.35em 0.75em;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
    }

    & > .progress-bar {
        position: absolute;
        height: 100%;
        border-radius: 0.375em;
    }
}
</style>
