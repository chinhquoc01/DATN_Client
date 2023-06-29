<template>
    <v-app-bar>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title>
            <div class="d-flex">
                <div @click="clickHome" class="logo">Gigify</div>
                <div v-if="authStore.loggedIn && authStore.isFreelancer()" @click="clickProposal" class="nav-item ml-4">Ứng tuyển</div>
                <div v-if="authStore.loggedIn && authStore.isFreelancer()" @click="clickContracts" class="nav-item ml-4">Hợp đồng</div>
                <div v-if="authStore.loggedIn" @click="clickMessage" class="nav-item ml-4">Tin nhắn</div>
            </div>
        </v-app-bar-title>
        <v-btn v-if="!authStore.loggedIn" class="" :to="{ name: 'login' }">Đăng nhập</v-btn>
        <v-btn v-if="!authStore.loggedIn" class="" color="primary" :to="{ name: 'signup' }">Đăng ký</v-btn>
        <img v-if="authStore.loggedIn" :src="authStore.userInfo.avatar || `https://ui-avatars.com/api/?name=${authStore.userInfo.name}`" class="rounded-circle h-75" alt="" srcset="">
        <v-btn v-if="authStore.loggedIn" class="" color="primary" @click="signOut">Đăng xuất</v-btn>
    </v-app-bar>
</template>

<script setup>
import router from '@/router';
import { useToast } from 'vue-toastification';
import { store } from '@/stores';
const authStore = store.useAuthStore()
const toast = useToast()
const clickHome = () => {
    router.push({ name: 'home' })
}
const clickMessage = () => {
    if (authStore.isClient()) {
        router.push({ name: 'chatClient'})
    } else if (authStore.isFreelancer()) {
        router.push({ name: 'chatFreelancer'})
    }
}
const clickProposal = () => {
    router.push({ name: 'proposalList' })
}

const clickContracts = () => {
    router.push({name: 'contractList'})
}
const signOut = () => {
    authStore.logout()
    toast.success('Đăng xuất thành công')
    router.push({name: 'home'})
}
</script>

<style scoped>
.logo {
    cursor: pointer;
    width: fit-content;
}
.nav-item {
    cursor: pointer;

}
</style>