<template>
    <v-app-bar>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title>
            <div @click="clickHome" class="logo">Gigify</div>
        </v-app-bar-title>
        <v-btn v-if="!authStore.loggedIn" class="" :to="{ name: 'login' }">Đăng nhập</v-btn>
        <v-btn v-if="!authStore.loggedIn" class="" color="primary" :to="{ name: 'signup' }">Đăng ký</v-btn>
        <img v-if="authStore.loggedIn" :src="`https://ui-avatars.com/api/?name=${authStore.userInfo.name}`" class="rounded-circle h-75" alt="" srcset="">
        <v-btn v-if="authStore.loggedIn" class="" color="primary" @click="signOut">Đăng xuất</v-btn>
    </v-app-bar>
</template>

<script setup>
import router from '@/router';
import { store } from '@/stores';
const authStore = store.useAuthStore()
const clickHome = () => {
    // let loadingStore = store.useLoadingStore()
    // loadingStore.setLoading(true)
    router.push({ name: 'home' })
}
const signOut = () => {
    authStore.logout()
    router.push({name: 'home'})
}
</script>

<style scoped>
.logo {
    cursor: pointer;
    width: fit-content;
}
</style>