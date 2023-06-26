import { BaseApi } from "./baseApi";

class UserApi extends BaseApi {
    constructor() {
        super('Users')
    }

    async getAll() {
        
        let res = await this.get(this.API_URL)
        return res
    }

    async getUserById(userId) {
        let res = await this.get(this.API_URL + `/${userId}`)
        return res
    }
}

export default new UserApi()