import { BaseApi } from "./baseApi";

class WorkApi extends BaseApi {
    constructor() {
        super('Works')
    }

    async getAll() {    
        let res = await this.get(this.API_URL)
        return res
    }
    
    async postWork(workInfo) {
        let res = await this.post(this.API_URL, workInfo)
        return res
    }
}

export default new WorkApi()