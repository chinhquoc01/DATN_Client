import { BaseApi } from "./baseApi";

class MessageApi extends BaseApi {
    constructor() {
        super('Messages')
    }

    async getUserMessage(userId) {
        let res = await this.get(this.API_URL + '/user' + `?userId=${userId}`)
        return res
    }

    async getChatHistory(senderId, recevierId) {
        let res = await this.get(this.API_URL + '/history' + `?senderId=${senderId}&receiverId=${recevierId}`)
        return res
    }

    async getAll() {
        
        let res = await this.get(this.API_URL)
        return res
    }
}

export default new MessageApi()