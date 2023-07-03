<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="6">
            <div>
                <v-tabs
                v-model="tab"
                bg-color="primary"
                align-tabs="center" 
                >
                    <v-tab value="one">Mô tả</v-tab>
                    <v-tab value="two">Ứng tuyển</v-tab>
                    <v-tab value="three" >Tiến độ công việc</v-tab>
                </v-tabs>

                <v-card-text>
                    <v-window v-model="tab">
                        <v-window-item value="one">
                            <div>
                                work info
                                <div v-for="file in attachments">
                                    <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                </div>
                            </div>
                        </v-window-item>

                        <v-window-item value="two">
                            <div id="proposal-section">
                                <div v-if="proposalList && proposalList.length > 0">
                                    <div v-for="(proposal, index) in proposalList" :key="index">
                                        <div class="d-flex proposal-item">
                                            <div class="avatar-container">
                                                <img :src="proposal.avatar || `https://ui-avatars.com/api/?name=${proposal.freelancerName}`" class="rounded-circle" alt="" srcset=""/>
                                            </div>
                                            <div class="flex-column w-100">
                                                <div class="d-flex justify-space-between align-center">
                                                    <div>{{ proposal.freelancerName }} <b v-if="proposal.jobTitle">({{ proposal.jobTitle }})</b></div>
                                                    <div class="d-flex">
                                                        <v-btn color="success" rounded="xl" size="medium" class="pr-2 pl-2" variant="outlined" @click="message(proposal)">
                                                            Nhắn tin
                                                        </v-btn>
                                                        <v-btn v-if="proposal.status == enums.proposalStatus.pending" color="success" rounded="xl" class="ml-2" size="small" variant="elevated" @click="accept(proposal)">
                                                            Gửi hợp đồng
                                                        </v-btn>
                                                        <v-btn v-else-if="proposal.status == enums.proposalStatus.negotiating" disabled color="success" rounded="xl" class="ml-2" size="small" variant="elevated">
                                                            Chờ xác nhận
                                                        </v-btn>
                                                        <v-chip v-else-if="proposal.status == enums.proposalStatus.accept" 
                                                            color="teal"
                                                            text-color="white"
                                                            prepend-icon="mdi-checkbox-marked-circle"
                                                            >
                                                            Đã chấp nhận
                                                        </v-chip>
                                                    </div>
                                                </div>
                                                <div>{{ proposal.address }}</div>
                                                <div>Thư ngỏ: {{ proposal.content }}</div>
                                                <div>Thu nhập mong muốn: {{ proposal.price }} VND</div>
                                                <v-chip-group>
                                                    <v-chip v-for="field in JSON.parse(proposal.skills)">{{ field }}</v-chip>
                                                </v-chip-group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div>Chưa có người ứng tuyển. Vui lòng mời</div>
                                </div>
                            </div>
                        </v-window-item>

                        <v-window-item value="three">
                            <div v-if="workProgress" class="work-progress">
                                <div class="d-flex">
                                    <div class="title-col">Thu nhập đề xuất:</div>
                                    <div>{{ workProgress.budget }} VND</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Thu nhập thoả thuận:</div>
                                    <div>{{ workProgress.expectedIncome }} VND</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Ngày bắt đầu:</div>
                                    <div>{{ workProgress.startDate }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Ngày kết thúc:</div>
                                    <div>{{ workProgress.endDate }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Tiến độ:</div>
                                    <div>{{ workProgress.progress }}%</div>
                                </div>
                                <div v-if="progressAttachments && progressAttachments.length" class="d-flex">
                                    <div class="title-col">Tệp đính kèm:</div>
                                    <div>
                                        <div v-for="file in progressAttachments" class="d-flex align-center">
                                            <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-end">
                                    <v-btn v-if="workInfo.status != enums.workStatus.completed" color="success" :disabled="workProgress.progress !== 100"
                                        :title="workProgress.progress == 100 ? '' : 'Tiến độ công việc cần đạt 100%'"
                                        @click="confirmComplete">Xác nhận hoàn thành</v-btn>
                                    <v-btn color="success" disabled>Đã hoàn thành</v-btn>
                                </div>
                            </div>
                            <div v-else>Công việc chưa được bàn giao</div>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </div>
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommonUltilities } from '@/services/commonUlti'
import workApi from '@/apis/workApi';
import proposalApi from '@/apis/proposalApi'
import attachmentApi from '@/apis/attachmentApi';
import { useAttachments } from '@/services/useAttachment';

const { route, toast, router, enums } = useCommonUltilities()

const {attachments, getFileKey, confirmDeleteFile, removeFile} = useAttachments()
const tab = ref(null)

const workId = route.params.workId
const workInfo = ref({})
const getWorkInfo = async () => {
    let res = await workApi.getById(workId)
    if (res && res.status == 200) {
        workInfo.value = res.data
        getFileKey(workInfo.value.id, enums.refType.JD)
        if (workInfo.value.freelancerId && workInfo.value.freelancerId != '00000000-0000-0000-0000-00000000') {
            getProgress(workInfo.value)
            getProgressAttach(workInfo.value.id)
        }
    }
}
getWorkInfo()

const proposalList = ref([])
const getProposalList = async () => {
    let res = await proposalApi.getProposalByWork(workId)
    if (res && res.status == 200) {
        proposalList.value = res.data
    } 
}
getProposalList()

const message = (proposal) => {
    router.push({
        name: 'chatClient',
        query: {
            userId: proposal.freelancerId,
            workId: proposal.workId
        }
    })
}

const accept = async (proposal) => {
    router.push({
        name: 'newContract',
        query: {
            proposalId: proposal.id
        }
    })
}

const workProgress = ref(null)
const getProgress = async (workInfo) => {
    let res = await workApi.getWorkFreelancerDetail(workInfo.id, workInfo.freelancerId)
    if (res && res.status == 200) {
        workProgress.value = res.data
    }
}

const progressAttachments = ref([])
const getProgressAttach = async (refId) => {
    let res = await attachmentApi.getFileKeyByRef(refId, enums.refType.workProgress)
    if (res && res.status == 200) {
        let fileKeys = res.data
        fileKeys.forEach(fileKey => {
            getAttachment(fileKey)
        });
    }

}
const getAttachment = async (fileName) => {
    let res = await attachmentApi.getByKey(fileName)
    if (res && res.status == 200) {
        let fileObj = {
            href: URL.createObjectURL(res.data),
            fileName: fileName
        }
        progressAttachments.value.push(fileObj)
    }
}

const confirmComplete = async () => {
    let res = await workApi.updateStatus(workInfo.value.id, enums.workStatus.completed)
    if (res && res.status == 200) {
        workInfo.value.status = enums.workStatus.completed
        toast.success('Cập nhật trạng thái thành công')
    }
}
</script>

<style scoped>
.proposal-item {
    border: 1px solid grey;
    padding: 8px;
}
.avatar-container {
    width: 75px ;
}
.title-col {
    min-width: 150px;
}
.work-progress > div {
    margin-bottom: 10px;
}
</style>