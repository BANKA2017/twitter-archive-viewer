<script lang="ts" setup>

import {useMainStore} from "~/stores/main";
import {directoryOpen} from "browser-fs-access";

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
const dropEvent = async (e: DragEvent) => {
    e.preventDefault()
    //console.log(e)
    for (const item of e.dataTransfer.items) {
        // kind will be 'file' for file/directory entries.
        if (item.kind === "file") {
            const entry = await item.getAsFileSystemHandle()
            mainStore.updateCoreValue('globalHandle', entry)
            const tmpList = await readDir(entry, ['*'], ['rawdata'])
            const tmpListName = tmpList.map(x => x[0])
            mainStore.updateCoreValue('dataHandle', dataHandle.value.filter(x => !tmpListName.includes(x[0])).concat(tmpList))
        }
    }
}
</script>

<template>
    <div class="border-4 border-dotted h-full min-h-[200px] align-middle text-center cursor-pointer"
         @click="clickEvent" @dragenter="preventDrag" @dragover="preventDrag" @drop="dropEvent">
        drop folder(Chromium only) or click(All browser) to read archive folder
    </div>
</template>

<style scoped>

</style>