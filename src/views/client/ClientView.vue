<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            Client view
            <v-select
                label="Select"
                v-model="workStatus"
                @update:modelValue="updateWorkFilter"
                :items="workStatusList"
                item-title="title"
                item-value="value"
            ></v-select>
            <v-btn color="" size="large" :to="{name: 'newPost'}"
                variant="elevated">
                Đăng bài
            </v-btn>
            <v-sheet class="pt-6 w-100" rounded>
                <div v-for="work in workList">
                    <work-card :work-info="work"
                        @editWork="editWork"
                        @removeWork="popupRemoveWork">
                    </work-card>
                </div>
            </v-sheet>
        </v-col>
    <dialog-popup 
		v-model:is-show="isShowDialog"
		:title="'Xoá công việc'"
		:content="'Bạn có chắc chắn muốn xoá công việc này không?'"
		:confirm-text="'Xoá'"
        :data="popupData"
        @confirm="removeWork"
	></dialog-popup>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '@/stores/index'
import { useCommonUltilities } from '@/services/commonUlti'

import workApi from '@/apis/workApi'
import DialogPopup from '@/components/DialogPopup.vue';
import WorkCard from '@/components/WorkCard.vue'
import enums from '@/constants/enums';

const authStore = store.useAuthStore()
const { toast, router } = useCommonUltilities()

const workStatusList = ref([
    {title: 'Tất cả', value: -1},
    {title: 'Mới', value: enums.workStatus.new},
    {title: 'Đã giao', value: enums.workStatus.inProgress},
    {title: 'Đã hoàn thành', value: enums.workStatus.completed},
    {title: 'Đã huỷ', value: enums.workStatus.cancel},

])
const workStatus = ref(-1)
const updateWorkFilter = (e) => {
    let workStatusValue = workStatus.value != -1 ? workStatus.value : null
    getWorkListByClientId(workStatusValue)
}

const workList = ref([])
const clientId = authStore.userInfo.id
const getWorkListByClientId = async (workStatus = null) => {
    let res = await workApi.getByClientId(clientId, workStatus)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}

getWorkListByClientId()

const popupData = ref({})
const isShowDialog = ref(false)
const editWork = (workInfo) => {
    router.push({name: 'editPost', query: {
        id: workInfo.id
    }})
} 
const popupRemoveWork = (workInfo) => {
    popupData.value = workInfo
    isShowDialog.value = true
}
const removeWork = async (workInfo) => {
    isShowDialog.value = false
    let res = await workApi.removeById(workInfo.id)
    getWorkListByClientId()
    if (res && res.status == 200) {
        toast.success('Xoá công việc thành công')
    } else {
        toast.error('Có lỗi xảy ra')
    }
}
</script>