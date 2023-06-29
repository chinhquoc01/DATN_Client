import { BaseApi } from "./baseApi";

class ContractApi extends BaseApi {
    constructor() {
        super('Contracts')
    }

    async newContract(contract) {
        let res = await this.post(this.API_URL, contract)
        return res
    }
    
    async getContractByFreelancerId(freelancerId) {
        let res = await this.get(this.API_URL + `/freelancer?freelancerId=${freelancerId}`)
        return res
    }

    async approveContract(contractId, freelancerId) {
        let res = await this.post(this.API_URL + `/approve?contractId=${contractId}&freelancerId=${freelancerId}`)
        return res
    }

    async rejectContract(contractId, freelancerId) {
        let res = await this.post(this.API_URL + `/reject?contractId=${contractId}&freelancerId=${freelancerId}`)
        return res
    }

    async getContractDetail(contractId) {
        let res = await this.get(this.API_URL + `/detail?contractId=${contractId}`)
        return res
    }
    
}

export default new ContractApi()