<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="6">
            <div>
                work info
            </div>
            <div id="proposal-section">
                <div v-if="proposalList && proposalList.length > 0">
                    <div>Danh sách ứng tuyển</div>
                    <div v-for="(proposal, index) in proposalList" :key="index">
                        <div class="d-flex proposal-item">
                            <div class="avatar-container">
                                <img :src="proposal.avatar || `https://ui-avatars.com/api/?name=${proposal.freelancerName}`" class="rounded-circle" alt="" srcset=""/>
                            </div>
                            <div class="flex-column w-100">
                                <div class="d-flex justify-space-between align-center">
                                    <div>{{ proposal.freelancerName }} <b v-if="proposal.jobTitle">({{ proposal.jobTitle }})</b></div>
                                    <div class="d-flex">
                                        <v-btn color="success" rounded="xl" size="small" variant="outlined" @click="message(proposal)">
                                            Nhắn tin
                                        </v-btn>
                                        <v-btn v-if="proposal.status == enums.proposalStatus.pending" color="success" rounded="xl" class="ml-2" size="small" variant="elevated" @click="accept(proposal)">
                                            Gửi hợp đồng
                                        </v-btn>
                                        <v-btn v-if="proposal.status == enums.proposalStatus.negotiating" disabled color="success" rounded="xl" class="ml-2" size="small" variant="elevated">
                                            Chờ xác nhận
                                        </v-btn>
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
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommonUltilities } from '@/services/commonUlti'
import workApi from '@/apis/workApi';
import proposalApi from '@/apis/proposalApi'

const { route, toast, router, enums } = useCommonUltilities()

const workId = route.params.workId
const workInfo = ref({})
const getWorkInfo = async () => {
    let res = await workApi.getById(workId)
    if (res && res.status == 200) {
        workInfo.value = res.data
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
</script>

<style scoped>
.proposal-item {
    border: 1px solid grey;
    padding: 8px;
}
.avatar-container {
    width: 75px ;
}
</style>