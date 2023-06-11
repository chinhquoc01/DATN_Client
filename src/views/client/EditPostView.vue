<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div class="text-h5">Sửa công việc</div>
            <v-sheet class="pt-6 w-100" rounded>
                <v-card class="mx-auto px-6 py-8">
                    <v-form @submit.prevent="onSubmit" validate-on="input">
                        <v-text-field v-model="jobInfo.title" :readonly="loading" :rules="requiredRule" class="mb-2"
                            clearable label="Tiêu đề"></v-text-field>

                        <v-radio-group v-model="jobInfo.type" inline>
                            <template v-slot:label>
                                <div>Loại công việc</div>
                            </template>
                            <v-radio label="Online" :value="0"></v-radio>
                            <v-radio label="Offline" :value="1"></v-radio>
                            <v-radio label="Hybrid" :value="2"></v-radio>
                        </v-radio-group>

                        <v-text-field v-if="jobInfo.type == 1 || jobInfo.type == 2" 
                            v-model="jobInfo.location" 
                            :readonly="loading" 
                            :rules="requiredRule" 
                            class="mb-2"
                            clearable 
                            label="Địa chỉ"></v-text-field>

                        <v-combobox v-model="jobInfo.fieldTagList" :items="skills" label="Kỹ năng công việc" multiple
                            chips></v-combobox>

                        <v-radio-group v-model="jobInfo.budgetType" inline>
                            <template v-slot:label>
                                <div>Cách tính công</div>
                            </template>
                            <v-radio label="Theo giờ" :value="0"></v-radio>
                            <v-radio label="Theo công việc" :value="1"></v-radio>
                        </v-radio-group>

                        <v-text-field v-model="jobInfo.budget" :readonly="loading" type="number" class="mb-2"
                        clearable label="Ngân sách" suffix="VND"></v-text-field>
                            
                        <v-textarea
                            counter
                            label="Mô tả"
                            :rules="requiredRule"
                            v-model="jobInfo.description"
                            >
                        </v-textarea>
                        <br>

                        <v-btn :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Lưu bài
                        </v-btn>
                    </v-form>
                </v-card>
            </v-sheet>
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import skillList from '@/constants/skillList.js'
import workApi from '@/apis/workApi.js'
import { useAuthStore } from '@/stores/authStore';
import { useCommonUltilities } from '@/services/commonUlti'

const { route, router, toast, enums } = useCommonUltilities()
const authStore = useAuthStore()

const skills = ref(skillList)
const loading = ref(false)
const form = ref(true)

const jobInfo = ref({})
const getJobById = async (jobId) => {
    let res = await workApi.getById(jobId)
    if (res && res.status == 200) {
        jobInfo.value = res.data
        jobInfo.value.fieldTagList = JSON.parse(res.data.fieldTag)
    }
}
getJobById(route.query.id)

const requiredRule = ref([
    v => !!v || 'Thông tin không được bỏ trống'
])

const onSubmit = async () => {
    if (!form.value) return
    // if (jobInfo.value.userType == 1 && jobInfo.value.skillList) {
    //     jobInfo.value.skills = JSON.stringify(jobInfo.value.skillList)
    // } else {
    //     jobInfo.value.skills = JSON.stringify([])
    // }
    jobInfo.value.fieldTag = JSON.stringify(jobInfo.value.fieldTagList)

    loading.value = true
    let res = await workApi.editWork(jobInfo.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        toast.success('Sửa công việc thành công')
        await router.push({ name: 'clientView' })
    } else {
        toast.error(res.data.userMsg || 'Có lỗi xảy ra')
    }

    setTimeout(() => (loading.value = false), 2000)
}

</script>