import { BaseApi } from "./baseApi";

class ReviewApi extends BaseApi {
    constructor() {
        super('Reviews')
    }

    async addReview(review) {
        let res = await this.post(this.API_URL, review)
        return res
    }
}

export default new ReviewApi()