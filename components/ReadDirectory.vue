<script lang="ts" setup>

import {useMainStore} from "~/stores/main";
import {directoryOpen, fileOpen, supported} from "browser-fs-access";
import {onMounted} from "vue";
import * as zip from "@zip.js/zip.js";

const mainStore = useMainStore()
const dataHandle = computed(() => mainStore.dataHandle)
const readDir = async (handle: FileSystemDirectoryEntry, passList: string[] = [], blockList: string[] = []): Promise<[string, FileSystemFileHandle][]> => {
    //pre-check

    if (passList.length === 0) {
        return
    }
    let tmpList: [string, FileSystemFileHandle][] = []
    const tmpHandleList = []
    for await (const entry of handle.values()) {
        tmpHandleList.push(entry)
    }
    for (const entry of tmpHandleList.sort((a, b) => b.kind - a.kind)) {
        //console.log(entry)
        if (blockList.includes(entry.name) || blockList.includes(entry?.directoryHandle?.name) || blockList.includes(entry?.handle?.name) || ((entry?.webkitRelativePath || '').split('/').some((path: string) => blockList.includes(path)))) {
            continue
        }
        if (passList.includes(entry.name) || (passList.length === 1 && passList[0] === '*')) {
            //console.log(entry.name, entry)
            tmpList = tmpList.concat([[entry.name, entry]])

            passList = passList.filter(x => x !== entry.name)
            if (entry.kind === 'directory') {
                tmpList = tmpList.concat(await readDir(entry, passList, blockList))
            }
        } else if (entry.kind === 'directory') {
            tmpList = tmpList.concat(await readDir(entry, passList, blockList))
        }
    }
    return tmpList
}

const preventDrag = (e: DragEvent) => {
    e.preventDefault()
}
const clickEvent = async (e: ClickEvent) => {
    const dirHandle = await directoryOpen({recursive: true,})//await window.showDirectoryPicker()
    //console.log(dirHandle)
    mainStore.updateCoreValue('globalHandle', dirHandle)
    const tmpList = await readDir(dirHandle, ['*'], ['rawdata'])
    const tmpListName = tmpList.map(x => x[0])
    mainStore.updateCoreValue('dataHandle', dataHandle.value.filter(x => !tmpListName.includes(x[0])).concat(tmpList))
}

const clickZipEvent = async (e: ClickEvent) => {
    const zipHandle = await fileOpen({mimeTypes: ['application/zip', 'application/json'],})//await window
    if (zipHandle.type === 'application/json') {
        const fileBlob = zipHandle.handle ? await zipHandle.handle.getFile() : (zipHandle.getFile ? await zipHandle.getFile() : zipHandle)
        mainStore.updateCoreValue('globalHandle', true)
        mainStore.updateCoreValue('flexible', 2)
        mainStore.updateCoreValue('dataHandle', [['data.json', fileBlob]])
    } else if (zipHandle.type === 'application/zip') {
        //console.log(zipHandle)// .showDirectoryPicker()
        const globalHandle = new zip.ZipReader(new zip.BlobReader(zipHandle))
        mainStore.updateCoreValue('globalHandle', globalHandle)
        const fileList = (await globalHandle.getEntries()).filter(file => !file.directory && !file.filename.includes('/rawdata/')).map(file => [file.filename.split('/').pop(), file])
        const tmpListName = fileList.map(x => x[0])
        mainStore.updateCoreValue('dataHandle', dataHandle.value.filter(x => !tmpListName.includes(x[0])).concat(fileList))
    }
}

const dropEvent = async (e: DragEvent) => {
    e.preventDefault()
    let count = 0
    for (const item of e.dataTransfer.items) {
        if (item.kind !== 'file') {continue}
        const entry = await item.getAsFileSystemHandle()
        console.log(entry)
        if (count === 0 && entry.name.endsWith('.zip')) {
            const fileBlob = await entry.getFile()
            const globalHandle = new zip.ZipReader(new zip.BlobReader(fileBlob))
            mainStore.updateCoreValue('globalHandle', globalHandle)
            const fileList = (await globalHandle.getEntries()).filter(file => !file.directory && !file.filename.includes('/rawdata/')).map(file => [file.filename.split('/').pop(), file])
            const tmpListName = fileList.map(x => x[0])
            mainStore.updateCoreValue('dataHandle', dataHandle.value.filter(x => !tmpListName.includes(x[0])).concat(fileList))
        } else if (count === 0 && entry.name.endsWith('.json')) {
            const fileBlob = await entry.getFile()
            mainStore.updateCoreValue('globalHandle', true)
            mainStore.updateCoreValue('flexible', 2)
            mainStore.updateCoreValue('dataHandle', [['data.json', fileBlob]])
        } else {
            // kind will be 'file' for file/directory entries.
            mainStore.updateCoreValue('globalHandle', entry)
            const tmpList = await readDir(entry, ['*'], ['rawdata'])
            const tmpListName = tmpList.map(x => x[0])
            mainStore.updateCoreValue('dataHandle', dataHandle.value.filter(x => !tmpListName.includes(x[0])).concat(tmpList))
        }
        count++
    }
}
const isChrome = ref<boolean>(false)
const isMobile = ref<boolean>(false)

const mobileCheck = () => {
    let check = false;
    (function(a){if(/(iPad|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

onMounted(() => {
    isChrome.value = !!(window.chrome)
    isMobile.value = mobileCheck()
})
</script>

<template>
    <div class="select-none">
        <div v-if="supported" class="border-4 rounded-xl border-dashed dark:border-gray-400 dark:hover:border-white border-gray-800 transition-all hover:bg-gray-100 hover:dark:bg-gray-900 hover:border-dotted h-full min-h-[200px] text-center cursor-pointer"
             @click="clickEvent" @dragenter="preventDrag" @dragover="preventDrag" @drop="dropEvent">
            <div class="py-24">
                <div class=" text-2xl" >{{ isChrome ? 'Drop or Click' : 'Click' }}</div>
                <div class="text-gray-800 dark:text-gray-200">Folder only</div>
            </div>

        </div>
        <div v-else-if="!isMobile" @click="clickEvent" class="my-2 px-3 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer transition-colors text-xl">Upload <span class="bg-sky-100 dark:bg-sky-900 px-1 rounded">folder</span></div>
        <div @click="clickZipEvent" class="my-2 px-3 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer transition-colors text-xl">Upload <span class="bg-sky-100 dark:bg-sky-900 px-1 rounded">*.zip</span> or <span class="bg-sky-100 dark:bg-sky-900 px-1 rounded">*.json</span></div>

        <!--<div class="my-2">
            <div class="inline-block mr-1 px-2 text-sm rounded-full bg-sky-500" v-if="isChrome">Chrome</div>
            <div class="inline-block mr-1 px-2 text-sm rounded-full bg-sky-500" v-if="isMobile">Mobile</div>
        </div>-->
    </div>
</template>

<style scoped>

</style>