import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router";
import {getCookie, go_page} from "@/utils";
import {localStore} from "@/store";


const request = axios.create({
    // baseURL: 'http://localhost:8000',
    baseURL: 'https://yougi.top/',
    withCredentials: true
})

request.interceptors.request.use((config) => {
    // Django SessionAuthentication needs csrf token
    // fucked
    config.headers['X-CSRFToken'] = getCookie('csrftoken')
    return config
})


request.interceptors.response.use(
    (response) => {
        const data = response.data
        console.log('response => ', response)
        if (data.status === '401') {
            localStorage.removeItem('userInfo');
            ElMessage({
                message: '服务器拒绝请求，可能是因为登录已过期，请重新登录。若错误持续，请联系管理员',
                type: 'error',
                duration: 1.5 * 1000
            })
            return router.push('/login')
        } else if (data.status === 'error') {
            ElMessage({
                message: data.error || data.status,
                type: 'error',
                duration: 1.5 * 1000
            })
        }

        if (data.success === false && data.msg) {
            ElMessage({
                message: data.msg,
                type: 'error',
                duration: 1.5 * 1000
            })
        }

        return data
    },
    async ({message, response}) => {
        console.log('err => ', message, response) // for debug
        if (response && response.data && response.data.detail) {
            ElMessage({
                message: response.data.detail,
                type: 'error',
                duration: 2 * 1000
            })
        } else {
            ElMessage({
                message: message,
                type: 'error',
                duration: 2 * 1000
            })
        }
        if (response && (response.status === 403 || response.status === 401)) {
            const store = localStore()
            await store.clearUser()
            return go_page('login')
        }
        return Promise.reject(message)
    }
)
export default request;
