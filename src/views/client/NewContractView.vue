<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div>work detail</div>

            <!-- proposal form -->
            <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input">
                <v-text-field v-model="contract.budget" :readonly="loading" type="number" class="mb-2"
                        clearable label="Ngân sách" suffix="VND"></v-text-field>

                <v-radio-group v-model="contract.budgetType" inline>
                    <template v-slot:label>
                        <div>Cách tính công</div>
                    </template>
                    <v-radio label="Theo giờ" :value="0"></v-radio>
                    <v-radio label="Theo công việc" :value="1"></v-radio>
                </v-radio-group>
                <div class="d-md-flex">
                    <div>
                        <label for="" class="v-label">
                            Ngày bắt đầu
                        </label>
                        <VueDatePicker v-model="contract.startDate"></VueDatePicker>
                    </div>
                    <div>
                        <label for="" class="v-label">Ngày kết thúc</label>
                        <VueDatePicker v-model="contract.endDate"></VueDatePicker>
                    </div>

                </div>
                <v-file-input label="Tệp đính kèm" multiple v-model="addedFiles" prepend-icon="" append-icon="mdi-paperclip"></v-file-input>
                <v-btn :disabled="!form" :loading="loading" class="mt-3" color="success" size="large" type="submit"
                    variant="elevated">
                    Gửi hợp đồng
                </v-btn>
            </v-form>
        </v-col>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useCommonUltilities } from '@/services/commonUlti'
import proposalApi from '@/apis/proposalApi';
import contractApi from '@/apis/contractApi';
import { useAuthStore } from '@/stores/authStore';
import workApi from '@/apis/workApi';
import attachmentApi from '@/apis/attachmentApi';
import { useAttachments } from '@/services/useAttachment';

const { enums, router, toast, route } = useCommonUltilities()
const authStore = useAuthStore()
const form = ref(false)
const loading = ref(false)
const contract = ref({})


const proposalId = route.query.proposalId
const proposal = ref({})
const getProposalInfo = async () => {
    let res = await proposalApi.getById(proposalId)
    if (res && res.status == 200) {
        proposal.value = res.data
        let workId = proposal.value.workId
        workInfo.value = await getWorkInfo(workId)
    }
}
getProposalInfo()


const workInfo = ref({})
const getWorkInfo = async (workId) => {
    let res = await workApi.getById(workId)
    if (res && res.status == 200) {
        return res.data
    }
    return {}
}

const { addedFiles, uploadAll } = useAttachments()

const onSubmit = async () => {
    if (!form.value) return
    contract.value.id = crypto.randomUUID()
    contract.value.contractName = workInfo.value.title
    contract.value.proposalId = proposalId
    contract.value.workId = proposal.value.workId
    contract.value.freelancerId = proposal.value.freelancerId
    contract.value.clientId = authStore.userInfo.id
    contract.value.status = enums.contractStatus.new
    
    loading.value = true
    let res = await contractApi.newContract(contract.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        uploadAll('contract', contract.value.id, enums.refType.contract)
        toast.success('Gửi hợp đồng thành công')
        await router.push({ name: 'clientView' })
    } else {
        toast.error(res.data.userMsg || 'Có lỗi xảy ra')
    }

    setTimeout(() => (loading.value = false), 2000)
}
</script>

<style scoped>
:deep(.dp__input_icon) {
    transform: translateY(-112%);
}
</style>