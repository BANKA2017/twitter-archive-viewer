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
import {useRoute, useRouter} from "vue-router";

useHead({
  charset: 'utf-8',
  htmlAttrs: {
    lang: "en"
  },
  title: 'Archive',
  keywords: 'Twitter Archive',
  description: 'Secret'
})

const mainStore = useMainStore()
const darkMode = computed(() => mainStore.dark)

onMounted(() => {
  //get data from storage
  if (localStorage.darkMode) {
      mainStore.updateCoreValue('dark', localStorage.darkMode)
    switchDarkModeAction(darkMode.value)
  } else {
      mainStore.updateCoreValue('dark', switchDarkMode('2'))
  }
})

const router = useRouter()

router.afterEach((to, from, next) => {
    if (to.name !== from.name) {
        mainStore.updateCoreValue('page', 0)
    } else if (to.query.page && !isNaN(Number(to.query.page))) {
        mainStore.updateCoreValue('page', Number(to.query.page))
    }
})

</script>

<style scoped>

</style>