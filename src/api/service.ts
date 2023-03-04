import request from "@/api/index";

export async function login(data: any) {
    return request({
        url: '/user/login/',
        method: 'post',
        data
    })
}

export async function logout() {
    return request({
        url: '/user/logout/',
        method: 'get'
    })
}


export async function register(data: any) {
    return request({
        url: '/register/',
        method: 'post',
        data
    })
}


export async function postResult(data: any) {
    return request({
        url: '/result/',
        method: 'post',
        data
    })
}

export async function createCompetition(comp: string, data: any) {
    if (comp === 'week') {
        return request({
            url: '/competition/create/week/',
            method: "post",
            data
        })
    } else {
        return request({
            url: '/competition/create/special/',
            method: "post",
            data
        })
    }
}
