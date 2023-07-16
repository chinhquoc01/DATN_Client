<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            Freelacner view
            <div>
                <v-select
                    label="Loại công việc"
                    v-model="workType"
                    :items="workTypeList"
                    @update:model-value="updateWorkFilter"
                    item-title="title"
                    item-value="value"
                ></v-select>
                <v-text-field v-model="searchQuery" placeholder="Tìm kiếm" 
                    @keyup.enter.prevent="updateWorkFilter"></v-text-field>

            </div>
            <div v-for="work in workList">
                <work-card-freelancer :work-info="work">
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

const { toast, router, enums } = useCommonUltilities()
const authStore = useAuthStore()
const workList = ref([])
const getSuggestWork = async (searchQuery = '', workType = null) => {
    let skillList = JSON.parse(authStore.userInfo.skills) ?? []
    let res = await workApi.getWorkForFreelancer(authStore.userInfo.id, authStore.userInfo.hourlyRate, skillList, searchQuery, workType)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}
getSuggestWork()

const workTypeList = ref([
    {title: 'Tất cả', value: -1},
    {title: 'Offline', value: enums.workType.offline},
    {title: 'Online', value: enums.workType.online},
    {title: 'Hybrid', value: enums.workType.hybrid},
])
const workType = ref(-1)
const searchQuery = ref('')

const updateWorkFilter = () => {
    let workTypeValue = workType.value != -1 ? workType.value : null
    if (searchQuery.value) {
        searchQuery.value = searchQuery.value.replace(/(\r\n|\n|\r)/gm, "")
    }
    getSuggestWork(searchQuery.value, workTypeValue)
}

</script>