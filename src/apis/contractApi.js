import { BaseApi } from "./baseApi";

class ContractApi extends BaseApi {
    constructor() {
        super('Contracts')
    }

    async newContract(contract) {
        let res = await this.post(this.API_URL, contract)
        return res
    }

    
}

export default new ContractApi()