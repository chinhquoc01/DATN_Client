<template>
    <v-app-bar>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title>
            <div class="d-flex">
                <div @click="clickHome" class="logo">Gigify</div>
                <div v-if="authStore.loggedIn && authStore.isFreelancer()" class="nav-item ml-4">
                    Tìm việc
                    <v-menu activator="parent" open-on-hover>
                        <v-list>
                            <v-list-item @click="clickProposal">Ứng tuyển</v-list-item>

                        </v-list>
                    </v-menu>
                </div>
                <div v-if="authStore.loggedIn && authStore.isFreelancer()" class="nav-item ml-4">
                    Công việc
                    <v-menu activator="parent" open-on-hover>
                        <v-list>
                            <v-list-item @click="clickMyJob">Việc của tôi</v-list-item>
                            <v-list-item @click="clickContracts">Hợp đồng</v-list-item>
                        </v-list>
                    </v-menu>
                </div>
                <div v-if="authStore.loggedIn" @click="clickMessage" class="nav-item ml-4">Tin nhắn</div>
            </div>
        </v-app-bar-title>
        <v-btn v-if="!authStore.loggedIn" class="" :to="{ name: 'login' }">Đăng nhập</v-btn>
        <v-btn v-if="!authStore.loggedIn" class="" color="primary" :to="{ name: 'signup' }">Đăng ký</v-btn>
        <v-avatar v-if="authStore.loggedIn" class="avatar">
            <v-img :src="authStore.userInfo.avatar || `https://ui-avatars.com/api/?name=${authStore.userInfo.name}`">
                <v-menu activator="parent">
                    <v-card>
                        <v-card-text>
                            <div class="mx-auto text-center">
                                <h2>{{ authStore.userInfo.name }}</h2>
                                <p class="text-caption mt-1">
                                    {{ authStore.isClient() ? 'Khách hàng' : 'Freelancer' }}
                                </p>
                                <p class="text-caption mt-1">
                                    {{ authStore.userInfo.email }}
                                </p>
                                <v-divider class="my-3"></v-divider>
                                <v-btn rounded variant="text">
                                    Edit Account
                                </v-btn>
                                <v-divider class="my-3"></v-divider>
                                <v-btn rounded variant="text">
                                    Disconnect
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-menu>
            </v-img>
        </v-avatar>
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
        router.push({ name: 'chatClient' })
    } else if (authStore.isFreelancer()) {
        router.push({ name: 'chatFreelancer' })
    }
}
const clickProposal = () => {
    router.push({ name: 'proposalList' })
}

const clickContracts = () => {
    router.push({ name: 'contractList' })
}
const clickMyJob = () => {
    router.push({ name: 'myWorks' })
}
const signOut = () => {
    authStore.logout()
    toast.success('Đăng xuất thành công')
    router.push({ name: 'home' })
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
.avatar {
    cursor: pointer;
}
</style>