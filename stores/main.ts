//TODO typescript interface
import {State} from "~/type/State";

export const useMainStore = defineStore('main', {
  state: (): State => ({
    dark: '0',
    globalHandle: null,
    dataHandle: [],
    page: 0,
    mode: 0, // 0 -> folder, 1 -> zip, 2 -> json (with flexible mode)
    flexible: 0,// 0 -> strict, full static, 1 -> flexible mode (read broadcast and audiospace media file from local), 2 -> online mode
  }),
  actions: {
    updateCoreValue<K extends keyof State>(key: K, value: State[K]) {
      this.$state[key] = value
    },
  }
})