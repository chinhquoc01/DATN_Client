import { BaseApi } from "./baseApi";

class WorkApi extends BaseApi {
    constructor() {
        super('Works')
    }

    async getAll() {    
        let res = await this.get(this.API_URL)
        return res
    }

    async getById(jobId) {
        let res = await this.get(this.API_URL+ '/' + jobId)
        return res
    }
    
    async postWork(workInfo) {
        let res = await this.post(this.API_URL, workInfo)
        return res
    }

    async editWork(workInfo) {
        let res = await this.put(this.API_URL + '/' + workInfo.id, workInfo)
        return res
    }

    async getByClientId(clientId) {
        let res = await this.get(this.API_URL + '/get-by-client-id?clientId=' + clientId)
        return res
    }

    async removeById(id) {
        let res = await this.delete(this.API_URL + '/' + id)
        return res
    }

    async getWorkForFreelancer(freelancerId, expectIncome, skillList) {
        let res = await this.post(this.API_URL + `/suggest-for-freelancer?freelancerId=${freelancerId}&expectIncome=${expectIncome}`, skillList)
        return res
    }

    async getProposalList(freelancerId) {
        let res = await this.get(this.API_URL + `/proposal-list?freelancerId=${freelancerId}`)
        return res
    }
}

export default new WorkApi()