import { BaseApi } from "./baseApi";

class MessageApi extends BaseApi {
    constructor() {
        super('Messages')
    }

    async getUserMessage(userId) {
        let res = await this.get(this.API_URL + '/user' + `?userId=${userId}`)
        return res
    }

    async getChatHistory(senderId, recevierId, limit, offset) {
        let res = await this.get(this.API_URL + '/history' + `?senderId=${senderId}&receiverId=${recevierId}&limit=${limit}&offset=${offset}`)
        return res
    }

    async getAll() {
        
        let res = await this.get(this.API_URL)
        return res
    }
}

export default new MessageApi()