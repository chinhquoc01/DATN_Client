import { BaseApi } from "./baseApi";

class ProposalApi extends BaseApi {
    constructor() {
        super('Proposals')
    }

    async getAll() {
        
        let res = await this.get(this.API_URL)
        return res
    }

    async newProposal(proposal) {
        let res = await this.post(this.API_URL, proposal)
        return res
    }
}

export default new ProposalApi()