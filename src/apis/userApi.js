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

    async updateUserInfo(userId, userInfo) {
        let res = await this.put(this.API_URL + `/${userId}`, userInfo)
        return res
    }

    async rateUser(userId, ratePoint) {
        let res = await this.put(this.API_URL + `/rate?userId=${userId}&ratePoint=${ratePoint}`)
        return res
    }

    async getSuggestFreelancer(workField, fieldTags) {
        let res = await this.get(this.API_URL + `/suggest-freelancer?workField=${workField}&fieldTags=${fieldTags}`)
        return res
    }
}

export default new UserApi()