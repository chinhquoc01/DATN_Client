import axios from 'axios'
import { useLoadingStore } from "@/stores/loadingStore";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    } else {
        config.headers.Authorization = ''
    }
    return config;
}, function (error) {
    // Do something with request error
    useLoadingStore().setLoading(false)
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    useLoadingStore().setLoading(false)
    return Promise.reject(error);
});

export class BaseApi {
    constructor(controllerName = '') {
        this.controllerName = controllerName
        this.API_URL = `${import.meta.env.VITE_BASE_URL}/api/` + this.controllerName
        this.config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        
    }

    async get(url) {
        try {
            let response = await axios.get(url, this.config)
            return this.handleResponse(response)

        } catch (error) {
            return this.handleError(error)
        }
    }

    async post(url, param) {
        try {
            let response = await axios.post(url, param, this.config)
            return this.handleResponse(response)
            
        } catch (error) {
            return this.handleError(error)
        }
    }

    async put(url, param) {
        try {
            let response = await axios.put(url, param, this.config)
            return this.handleResponse(response)
            
        } catch (error) {
            return this.handleError(error)
        }
    }

    async delete(url) {
        try {
            let response = await axios.delete(url, this.config)
            return this.handleResponse(response)
            
        } catch (error) {
            return this.handleError(error)
        }
    } 

    handleResponse(response) {
        return response
    }

    handleError(response) {
        return {
            status: response.response.status,
            data: response.response.data
        }
    }
}
