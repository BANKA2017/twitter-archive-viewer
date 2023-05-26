//TODO typescript interface
import {State} from "~/type/State";

export const useMainStore = defineStore('main', {
  state: (): State => ({
    dark: '0',
    globalHandle: null,
    dataHandle: []
  }),
  actions: {
    updateCoreValue<K extends keyof State>(key: K, value: State[K]) {
      this.$state[key] = value
    },
  }
})