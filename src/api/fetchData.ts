import request from "@/api/index";
import type {
    Announcement,
    CachedResult,
    DetailedCompetition,
    OmittedCompetition,
    OmittedResultAvg,
    OmittedResultBest, QQBindingRequest,
    RankPaginationData,
    Record,
    RecordWithScore,
    Result,
    Room,
    Score,
    Scramble,
    User,
    UserParticipationData,
} from "@/types";
import {localStore} from "@/store";

export async function getComp (compId: string): Promise<DetailedCompetition> {
    let res
    // 当comp为'week'，查询当前周赛；为' special '，查询当前正赛；为其它，查询compId对应的比赛
    switch (compId) {
        case 'week':
            res = await request({
                url: '/competition/week/ongoing/',
                method: 'get',
            })
            break
        case 'special':
            res = await request({
                url: '/competition/special/ongoing/',
                method: 'get',
            })
            break
        default:
            res = await request({
                url: `/competition/detail/${compId}/`,
                method: 'get',
            })
    }

    const result_set: Result[] = []
    if (res['result_set'].length > 0) {
        for (const result_req of res['result_set']) {
            const result: Result = {
                username: result_req['user'],
                event: result_req['event'],
                time_1: result_req['time_1'],
                time_2: result_req['time_2'],
                time_3: result_req['time_3'],
                time_4: result_req['time_4'],
                time_5: result_req['time_5'],
                avg: result_req['avg'],
                best: result_req['best'],
                is_avg_scur: result_req['is_avg_scur'],
                is_best_scur: result_req['is_best_scur'],
                date: result_req['date'],
                competition: result_req['competition'],
            }
            result_set.push(result)
        }
    }
    const scramble_set: Scramble[] = []
    if (res['scramble_set'].length > 0) {
        for (const scramble_req of res['scramble_set']) {
            const scramble: Scramble = {
                event: scramble_req['event'],
                scramble_1: scramble_req['scramble_1'],
                scramble_2: scramble_req['scramble_2'],
                scramble_3: scramble_req['scramble_3'],
                scramble_4: scramble_req['scramble_4'],
                scramble_5: scramble_req['scramble_5'],
            }
            scramble_set.push(scramble)
        }
    }
    return {
        compId: res['compId'],
        is_normal: res['is_normal'],
        ongoing: res['ongoing'],
        user_count: res['user_count'],
        event_count: res['event_count'],
        result_set: result_set,
        scramble_set: scramble_set,
        is_record: res['is_record']
    }
}


export async function getCompCachedResult (compId: string): Promise<CachedResult[]> {
    let res
    // 当comp为'week'，查询当前周赛；为' special '，查询当前正赛；为其它，查询compId对应的比赛
    switch (compId) {
        case 'week':
            res = await request({
                url: '/competition/cached-result/?wos=week',
                method: 'get',
            })
            break
        case 'special':
            res = await request({
                url: '/competition/cached-result/?wos=special',
                method: 'get',
            })
            break
    }

    const tempResults: CachedResult[] = []
    if ('detail' in res) {
        return tempResults
    }
    for (const result of res) {
        tempResults.push({
            event: result['event'],
            time_1: result['time_1'],
            time_2: result['time_2'],
            time_3: result['time_3'],
            time_4: result['time_4'],
            time_5: result['time_5'],
        })
    }

    return tempResults
}


export async function getScuRecord (): Promise<Record> {
    const res = await request({
        url: '/scur/',
        method: 'get',
    })

    const record: Record = {
        avg: [],
        best: []
    }

    for (const result of res['avg']) {
        const result_: OmittedResultAvg = {
            avg: result['avg'],
            username: result['username'],
            event: result['event'],
            date: result['date']
        }
        record.avg.push(result_)
    }

    for (const result of res['best']) {
        const result_: OmittedResultBest = {
            best: result['best'],
            username: result['username'],
            event: result['event'],
            date: result['date']
        }
        record.best.push(result_)
    }

    return record
}


export async function getCompetitionList (): Promise<OmittedCompetition[]>  {
    const res = await request({
        url: '/competition/',
        method: 'get'
    })
    const compList: OmittedCompetition[] = []

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const comp of res) {
        compList.push({
            compId: comp['compId'],
            ongoing: comp['ongoing'],
            is_normal: comp['is_normal'],
            event_count: comp['event_count'],
            user_count: comp['user_count'],
        })
    }

    return compList
}


export async function getRank (event: string, aorb: string, page: number): Promise<RankPaginationData> {
    const res = await request({
        url: `/rank/${event}/${aorb}/?page=${page}`,
        method: 'get'
    })

    return {
        count: res['count'],
        current: res['current'],
        results: res['results']
    }
}


export async function getUserParticipationData (): Promise<UserParticipationData> {
    const res_week = await request({
        url: `/user/finished/week/`,
        method: 'get'
    })

    const res_special = await request({
        url: `/user/finished/special/`,
        method: 'get'
    })

    return {
        week: {
            events_all: res_week['events_all'],
            events_finished: res_week['events_finished']
        },
        special: {
            events_all: res_special['events_all'],
            events_finished: res_special['events_finished']
        }
    }
}

export async function getUserPb (): Promise<RecordWithScore> {
    const res = await request({
        url: '/user/data/',
        method: 'get'
    })

    const store = localStore()
    const username = store.user.username

    for (const result of res['avg']){
        result['username'] = username
        delete result['compId']
    }

    const pb: RecordWithScore = {
        avg: [],
        best: [],
        score: 0
    }

    for (const result of res['avg']) {
        const result_: OmittedResultAvg = {
            avg: result['avg'],
            username: result['username'],
            event: result['event'],
            date: result['date']
        }
        pb.avg.push(result_)
    }

    for (const result of res['best']) {
        const result_: OmittedResultBest = {
            best: result['best'],
            username: result['username'],
            event: result['event'],
            date: result['date']
        }
        pb.best.push(result_)
    }

    pb.score = res['score']

    return pb
}


export async function getAnnouncement (type: 'update' | 'scur break' | 'announcement' | 'ua'): Promise<Announcement[]> {
    let res
    if (type === 'update') {
        res = await request({
            url: '/post/update/',
            method: 'get'
        })
    } else if (type === 'scur break') {
        res = await request({
            url: '/post/break/',
            method: 'get'
        })
    } else if (type === 'announcement') {
        res = await request({
            url: '/post/announcement/',
            method: 'get'
        })
    } else {  // type === 'ua', meaning update and announcement
        res = await request({
            url: '/post/ua/',
            method: 'get'
        })
    }

    const announcements: Announcement[] = []
    for (const announcement of res) {
        announcements.push({
            title: announcement['title'],
            content: announcement['content'],
            date: announcement['date'],
            author: announcement['user'],
            type: announcement['type']
        })
    }

    return announcements
}


export async function getProfile(username: string): Promise<User> {
    const res = await request({
        url: `/user/profile/${username}/`,
    })

    return {
        id: res['id'],
        username: res['username'],
        email: res['email'],
        is_scuer: res['is_scuer'],
        is_superuser: res['is_superuser'],
        is_active: res['is_active'],
        avatar: res['avatar'],
        description: res['description'],
        qq: res['qq'],
        WCAID: res['WCAID'],
    }
}


export async function getAvatarToken(key: string): Promise<string> {
    const res = await request({
        url: `/qiniu/avatars/token/${key}/`,
    })

    return res['token']
}


export async function getScoreRank(): Promise<Score[]> {
    const res: Array<object> = await request({
        url: '/competition/week/score/',
    })

    const scores: Score[] = []
    for (const score of res) {
        scores.push({
            username: score['username'],
            score: score['score'],
        })
    }

    return scores
}


export async function getRoomList(): Promise<Room[]> {
    const res: Array<object> = await request({
        url: '/rooms/',
    })

    const rooms: Room[] = []
    for (const room of res) {
        const players = room['players'].split(';')
        players.pop()
        const finished_players = room['finished_players'].split(';')
        finished_players.pop()
        const room_: Room = {
            room_name: room['room_name'],
            event: room['event'],
            players: players,
            finished_players: finished_players,
            round: room['round'],
        }
        rooms.push(room_)
    }

    return rooms
}


export async function getAllResultOfUser(): Promise<Result[]> {
    const store = localStore()
    const res: object = await request({
        url: `/user-with-result/${store.user.username}/`
    })

    const result_set = res['result_set']
    return result_set as Result[]
}


export async function checkQQBindingRequest(): Promise<QQBindingRequest> {
    const res = await request({
        url: '/user/checkqqbinding/',
        method: 'get'
    })

    const qqBindingRequest = res['QQBindingRequest']
    if (qqBindingRequest){
        return {
            qq: qqBindingRequest['QQNumber'],
            targetUser: qqBindingRequest['TargetUser'],
            secretKey: qqBindingRequest['secretKey'],
        }
    }
    else {
        return {
            qq: '',
            targetUser: '',
            secretKey: '',
        }
    }
}


export async function bindQQ(qq: string): Promise<QQBindingRequest> {
    const res = await request({
        url: '/user/createqqbinding/',
        method: 'post',
        data: {
            qq: qq
        }
    })

    const secret_Key = res['secretKey']
    const store = localStore()
    return {
        qq: qq,
        targetUser: store.user.username,
        secretKey: secret_Key,
    }
}

