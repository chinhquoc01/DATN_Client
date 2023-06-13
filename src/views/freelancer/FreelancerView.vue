<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            Freelacner view
            <div v-for="work in workList">
                <work-card-freelancer :work-info="work" @editWork="editWork" @removeWork="popupRemoveWork">
                </work-card-freelancer>
            </div>
        </v-col>
    </div>
</template>

<script setup>
import WorkCardFreelancer from '@/components/WorkCardFreelancer.vue';
import { ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAuthStore } from '@/stores/authStore';
import workApi from '@/apis/workApi';

const { toast, router } = useCommonUltilities()
const authStore = useAuthStore()
const workList = ref([])
const getSuggestWork = async () => {
    let skillList = JSON.parse(authStore.userInfo.skills) ?? []
    let res = await workApi.getWorkForFreelancer(authStore.userInfo.id, authStore.userInfo.hourlyRate, skillList)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}
getSuggestWork()
</script>