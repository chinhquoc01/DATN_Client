<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div>work detail
                <a v-for="file in attachments" :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
            </div>

            <!-- proposal form -->
            <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input">
                <v-text-field v-model="proposal.price" :readonly="loading" type="number" class="mb-2"
                        clearable label="Thu nhập mong muốn" suffix="VND"></v-text-field>

                <v-text-field v-model="proposal.content" :readonly="loading" :rules="requiredRule" class="mb-2"
                    clearable label="Lời ngỏ"></v-text-field>

                <v-file-input label="Tệp đính kèm" multiple v-model="addedFiles" prepend-icon="" append-icon="mdi-paperclip"></v-file-input>
                <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                    variant="elevated">
                    Ứng tuyển
                </v-btn>
            </v-form>
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import proposalApi from '@/apis/proposalApi'
import workApi from '@/apis/workApi';
import { useAuthStore } from '@/stores/authStore';
const { enums, router, toast, route } = useCommonUltilities()
import attachmentApi from '@/apis/attachmentApi';
import { useAttachments } from '@/services/useAttachment';

const authStore = useAuthStore()
const requiredRule = ref([
    v => !!v || 'Thông tin không được bỏ trống'
])

const {attachments, getFileKey, addedFiles, uploadAll} = useAttachments()


const loading = ref(false)
const form = ref(false)
const workId = route.params.workId
const proposal = ref({})
const workInfo = ref({})

const getWorkInfo = async () => {
    let res = await workApi.getById(workId)
    if (res && res.status == 200) {
        workInfo.value = res.data
        getFileKey(workInfo.value.id, enums.refType.JD)
    }
}
getWorkInfo()


const onSubmit = async () => {
    if (!form.value) return
    proposal.value.id = crypto.randomUUID()
    proposal.value.workId = workInfo.value.id
    proposal.value.freelancerId = authStore.userInfo.id
    proposal.value.status = enums.proposalStatus.pending
    
    loading.value = true
    let res = await proposalApi.newProposal(proposal.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        uploadAll('proposal', proposal.value.id, enums.refType.proposal)
        toast.success('Gửi ứng tuyển thành công')
        await router.push({ name: 'freelancerView' })
    } else {
        toast.error(res.data.userMsg || 'Có lỗi xảy ra')
    }

    setTimeout(() => (loading.value = false), 2000)
}
</script>