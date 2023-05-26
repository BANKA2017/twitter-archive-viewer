<template>
    <div id="full-text" :class="{'break-all': true, 'inline-block': !inline, 'inline': inline}">
        <div v-if="state.replyNameList.length > 0" class="mb-2" style="font-size: 0.8em">
            Replying to
            <template v-for="(name, index) in state.replyNameList" :key="name">
                <span v-if="index > 0" class="text-sky-500"> and </span>
                <router-link :to="'/' + name.replace('@', '') +'/all'" class="text-sky-500">{{ name }}</router-link>
            </template>
        </div>
        <template v-for="(obj, order) in state.textObject" :key="order">
        <span
            :class="{'font-bold': obj.richtext_types.includes('Bold'), 'italic': obj.richtext_types.includes('Italic')}">
            <template v-for="content in obj.content" :key="content">
                <template v-if="content.indices_start + 1 >= displayRange[0]">
                    <a v-if="content.type === 'hashtag' || content.type === 'symbol'"
                       :href="`https://twitter.com/search?q=`+(content.type === 'hashtag' ? '%23' : '%24') + content.text"
                       class="text-sky-500 underline-offset-1 hover:underline"
                       target="_blank" @click="e => {e.stopPropagation()}">
                        {{ (content.type === 'hashtag' ? '#' : '$') + content.text }}
                    </a>
                    <a v-else-if="content.type === 'user_mention'" :href="`https://twitter.com/`+content.text.substring(1)"
                       class="text-sky-500 underline-offset-1 hover:underline"
                       target="_blank" @click="e => {e.stopPropagation()}">
                        {{ content.text }}
                    </a>
                    <a v-else-if="content.type === 'url'" id="url" :href="content.expanded_url"
                       class="text-sky-500 underline-offset-1 hover:underline" target="_blank"
                       @click="e => {e.stopPropagation()}">{{ content.text }}</a>
                    <template v-else>
                        <template v-for="(text, textIndex) in content.text.split(`\n`)" :key="text">
                            <br v-if="content.text.includes(`\n`) && textIndex !== 0"/>
                            <span v-if="text">
                                {{ text }}
                            </span>
                        </template>
                    </template>
                </template>
            </template>
        </span>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type {Entity, RichText} from "~/type/Content"
import {onMounted, PropType, reactive, ref, Ref} from "vue";

const props = defineProps({
    full_text_origin: {
        type: String,
        default: ""
    },
    entities: {
        type: Array as PropType<Entity[]>,
        default: () => ([])
    },
    rich_text_tags: {
        type: Array as PropType<RichText["richtext_tags"]>,
        default: []
    },
    displayRange: {
        type: Array as PropType<[number, number]>,
        default: [0, 0]
    },
    inline: {
        type: Boolean,
        default: false
    }
})

const state = reactive<{
    replyNameList: Ref<string[]>
    breakCheckFlag: Ref<boolean>
    textObject: any[]
}>({
    replyNameList: ref([]),
    breakCheckFlag: ref(false),
    textObject: []
})

const spreadText = (text: string): string[] => text.split("\n")
const removeHTMLEntities = (text: string): string => text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll('&apos;', "'")//.replaceAll(' ', "&nbsp;")
const contentObjectBuilder = () => {
    const displayRange = props.displayRange?.length ? props.displayRange : [0, 0]

    let nextRichText = []
    const fe0f = String.fromCharCode(0xfe0f)
    let full_text_origin_array = [...props.full_text_origin]
    if (!props.rich_text_tags || props.rich_text_tags.length === 0) {
        nextRichText.push({
            from_index: 0,
            to_index: full_text_origin_array.length,
            richtext_types: [],
            content: [],
            text: full_text_origin_array.slice(0, full_text_origin_array.length).join('')
        })
    } else {
        props.rich_text_tags.forEach((tag, tag_index) => {
            //first content
            if (tag_index === 0 && tag.from_index > 0) {
                nextRichText.push({
                    from_index: 0,
                    to_index: tag.from_index - 1,
                    richtext_types: [],
                    content: [],
                    text: full_text_origin_array.slice(0, tag.from_index).join('')
                })
            }
            tag.content = []
            tag.text = full_text_origin_array.slice(tag.from_index, tag.to_index).join('')
            nextRichText.push(tag)
            if (tag_index >= props.rich_text_tags?.length - 1) {
                if (tag.to_index < full_text_origin_array.length) {
                    nextRichText.push({
                        from_index: tag.to_index,
                        to_index: full_text_origin_array.length,
                        richtext_types: [],
                        content: [],
                        text: full_text_origin_array.slice(tag.to_index, full_text_origin_array.length).join('')
                    })
                }
            } else {
                if (props.rich_text_tags?.[tag_index + 1].from_index >= tag.to_index + 1) {
                    nextRichText.push({
                        from_index: tag.to_index,
                        to_index: props.rich_text_tags?.[tag_index + 1].from_index,
                        richtext_types: [],
                        content: [],
                        text: full_text_origin_array.slice(tag.to_index, props.rich_text_tags?.[tag_index + 1].from_index).join('')
                    })
                }
            }
        })
    }

    for (const richItem of nextRichText) {
        const filterEntities = props.entities.filter(entity => (entity.indices_start >= richItem.from_index) && (entity.indices_end <= richItem.to_index))
        if (richItem.from_index < displayRange[0]) {
            state.replyNameList = filterEntities.filter(entity => entity.indices_start < displayRange[0] && entity.type === "user_mention").map(entity => entity.text)
        }


        const tmpEntities = filterEntities.sort((a, b) => a.indices_start - b.indices_start)

        const tmpContent = []
        if (tmpEntities.length) {
            for (const entity_index in tmpEntities) {
                const entity = tmpEntities[entity_index]

                if (entity_index === '0' && entity.indices_start > richItem.from_index) {
                    tmpContent.push({
                        expanded_url: "",
                        indices_end: entity.indices_start,
                        indices_start: richItem.from_index,
                        text: removeHTMLEntities(full_text_origin_array.slice(richItem.from_index, entity.indices_start).join('')),
                        type: "text",
                    })
                }

                tmpContent.push(entity)
                if (Number(entity_index) >= tmpEntities.length - 1) {
                    if ((entity.indices_end_backup || entity.indices_end) < richItem.to_index) {
                        tmpContent.push({
                            expanded_url: "",
                            indices_end: richItem.to_index,
                            indices_start: entity.indices_end,
                            text: removeHTMLEntities(full_text_origin_array.slice(entity.indices_end, richItem.to_index).join('').replace(/ https:\/\/t.co\/[\w]+/, '')),
                            type: "text",
                        })
                    }
                } else {
                    if (tmpEntities[Number(entity_index) + 1]?.indices_start > entity.indices_end) {
                        tmpContent.push({
                            expanded_url: "",
                            indices_end: tmpEntities[Number(entity_index) + 1].indices_start,
                            indices_start: entity.indices_end,
                            text: removeHTMLEntities(full_text_origin_array.slice(entity.indices_end, tmpEntities[Number(entity_index) + 1].indices_start).join('')),
                            type: "text",
                        })
                    }
                }
            }
        } else {
            tmpContent.push({
                expanded_url: "",
                indices_end: richItem.to_index,
                indices_start: richItem.from_index,
                text: removeHTMLEntities(full_text_origin_array.slice(richItem.from_index, richItem.to_index).join('').replace(/ https:\/\/t.co\/[\w]+/, '')),
                type: "text",
            })
        }
        richItem.content = tmpContent
    }
    return nextRichText;
}
onMounted(() => {
    state.textObject = contentObjectBuilder()
})
</script>
