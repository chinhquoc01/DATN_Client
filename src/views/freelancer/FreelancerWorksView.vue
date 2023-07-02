<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div v-for="work in workList">
                <work-card-freelancer :work-info="work"
                    :is-suggest-work="false"
                    @clickTitle="viewDetail">
                    <template #button>
                        <div>
                            <v-btn color="#5865f2" target="_blank" :to="{name: 'chatFreelancer', query: { userId: work.clientId }}" rounded="xl" variant="tonal">Nhắn tin</v-btn>
                        </div>
                    </template>
                </work-card-freelancer>
            </div>
        </v-col>
    </div>
    <work-detail-freelancer-popup
        ref="popup"
        :work-detail="workDetail"
        :is-show="isShow"
        @close="isShow = false">
    </work-detail-freelancer-popup>
</template>

<script setup>
import WorkCardFreelancer from '@/components/WorkCardFreelancer.vue';
import WorkDetailFreelancerPopup from '@/components/WorkDetailFreelancerPopup.vue';
import { nextTick, ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAuthStore } from '@/stores/authStore';
import workApi from '@/apis/workApi';

const popup = ref(null)

const { toast, router } = useCommonUltilities()
const authStore = useAuthStore()
const workList = ref([])
const getAcceptedWork = async () => {
    let skillList = JSON.parse(authStore.userInfo.skills) ?? []
    let res = await workApi.getByFreelancerId(authStore.userInfo.id)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}
getAcceptedWork()

const workDetail = ref({})
const isShow = ref(false)
const viewDetail = async (workInfo) => {
    let res = await workApi.getWorkFreelancerDetail(workInfo.id, authStore.userInfo.id)
    if (res && res.status == 200) {
        workDetail.value = res.data
        isShow.value = true
        await nextTick()
        popup.value.getAttachments()
    }
}

</script>