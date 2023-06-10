import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
    const globalLoading = ref(false)
    function setLoading(loading) {
        globalLoading.value = loading
    }

    return { globalLoading, setLoading }
})
