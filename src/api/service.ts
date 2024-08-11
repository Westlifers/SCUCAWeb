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

export async function postTempResult(data: any) {
    return request({
        url: `/competition/cached-result/?wos=${data['wos']}&event=${data['event']}&order=${data['order']}&result=${data['result']}`,
        method: 'post',
    })
}

export async function createCompetition(comp: string, data: any) {
    if (comp === 'week') {
        return request({
            // url: '/competition/create/week/',        // deprecated in 2024.8.11
            url: '/competition/quickweekcreation/',
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

export async function postAnnouncement (data: any) {
    let url
    switch (data['type']) {
        case 'update':
            url = '/post/update/'
            break
        case 'scur break':
            url = '/post/break/'
            break
        case 'announcement':
            url = '/post/announcement/'
            break
    }
    return request({
        url: url,
        method: 'post',
        data
    })
}

export async function postProfile(data: any) {
    return request({
        url: '/user/profile/',
        method: 'post',
        data
    })
}
