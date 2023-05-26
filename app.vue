<template>
    <div>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import {useMainStore} from "~/stores/main";
import {switchDarkMode, switchDarkModeAction} from "~/share/DarkMode";

useHead({
  charset: 'utf-8',
  htmlAttrs: {
    lang: "en"
  },
  title: 'Archive',
  keywords: 'Twitter Archive',
  description: 'Secret'
})

const store = useMainStore()
const darkMode = computed(() => store.dark)

onMounted(() => {
  //get data from storage
  if (localStorage.darkMode) {
    store.updateCoreValue('dark', localStorage.darkMode)
    switchDarkModeAction(darkMode.value)
  } else {
    store.updateCoreValue('dark', switchDarkMode('2'))
  }
})
</script>

<style scoped>

</style>