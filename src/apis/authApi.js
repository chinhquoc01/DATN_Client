import { BaseApi } from "./baseApi";

class AuthApi extends BaseApi {
    constructor() {
        super('Auth')
    }

    async login(userInfo) {
        let res = await this.post(this.API_URL + '/login', userInfo)
        return res
    }

    async signUp(userInfo) {
        let res = await this.post(this.API_URL + '/signup', userInfo)
        return res
    }

    async forgot(userInfo) {
        let res = await this.post(this.API_URL + '/forgot-password', userInfo)
        return res
    }

    async logout(userInfo) {

        return res
    }
}

export default new AuthApi()