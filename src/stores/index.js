import { useCounterStore } from './counterStore'
import { useLoadingStore } from './loadingStore'
import { useAuthStore } from './authStore'

export const store = {
    useCounterStore,
    useLoadingStore,
    useAuthStore
}