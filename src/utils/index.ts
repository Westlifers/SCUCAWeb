import router from "@/router";
import {getProfile} from "@/api/fetchData";
import {DetailedCompetition} from "@/types";

export function getCookie(cName: string) {
    if (document.cookie.length > 0) {
        let cStart = document.cookie.indexOf(cName + "=");
        if (cStart !== -1) {
            cStart = cStart + cName.length + 1;
            let cEnd = document.cookie.indexOf(";", cStart);
            if (cEnd === -1) cEnd = document.cookie.length;
            return unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return "";
}

export function go_page(pageName: string) {
    router.push({name: pageName})
}

export function convert_time(validatedTimeStr: string): number {
    let time = 0
    validatedTimeStr = validatedTimeStr.split(' ').join('')  // 去空格
    if (validatedTimeStr == 'DNF' || validatedTimeStr == 'dnf' || validatedTimeStr == '' || validatedTimeStr == 'd') {
        return 0
    }
    if (validatedTimeStr.indexOf(':') > -1) {
        time += parseFloat(validatedTimeStr.split(':')[0]) * 60
        validatedTimeStr = validatedTimeStr.split(':')[1]
    }
    if (validatedTimeStr.indexOf('.') > -1) {
        time += parseFloat(validatedTimeStr.split('.')[0])
        time += parseFloat(validatedTimeStr.split('.')[1]) / (10 ** validatedTimeStr.split('.')[1].length)
    }
    else {
        time += parseFloat(validatedTimeStr)
    }
    return time
}

export function time_convert(time: number): string {
    const min = Math.floor(time / 60)
    let sec = (time % 60).toFixed(3)
    // if sec < 10 and min > 0, add 0 before sec
    if (parseFloat(sec) < 10 && min > 0) {
        sec = '0' + sec
    }
    return min>0?`${min}: ${sec}`:`${sec}`
}

export const SPECIAL_EVENTS = ['333bld', '444bld', '555bld', '666', '777']
export const ALL_EVENTS = ['333', '222', '444', '555', '666', '777', '333bld', '333oh', 'clock', 'minx', 'pyra', 'skewb', 'sq1', '444bld', '555bld']


export async function get_user_avatar(username: string) {
    const res = await getProfile(username)
    return res.avatar?res.avatar:'http://img.yougi.top/default.png'
}


export function getUserAndEventAndAorb(content: string) {
    const pos_1 = content.indexOf('在')
    const pos_2 = content.indexOf('了')
    const pos_3 = content.indexOf('的')
    const pos_4 = content.indexOf('记录')
    const pos_5 = content.indexOf('：')
    const user = content.substring(0, pos_1)
    const event = content.substring(pos_2 + 1, pos_3)
    const aorb = content.substring(pos_3 + 1, pos_4)
    const time = content.substring(pos_5 + 1)
    return {
        user: user,
        event: event,
        aorb: aorb,
        time: parseFloat(time) > 0?time_convert(parseFloat(time)):'DNF'
    }
}


export function classifyTableDataByEvent(tableData: DetailedCompetition): object {
    const classifiedData = {}
    const eventsGot: string[] = []
    for (const result of tableData.result_set) {
        if (eventsGot.indexOf(result.event) > -1) {
            classifiedData[result.event].push(result)
        } else {
            classifiedData[result.event] = [result]
            eventsGot.push(result.event)
        }
    }

    return classifiedData
}


export function getSortedEventsFromTableData(tableData: DetailedCompetition): string[] {
    const eventsGot: string[] = []
    for (const scramble of tableData.scramble_set) {
        if (!(eventsGot.indexOf(scramble.event) > -1)) {
            eventsGot.push(scramble.event)
        }
    }

    // 排序
    const sorted_events:string[] = []
    for (const event of ALL_EVENTS) {
        if (eventsGot.indexOf(event) > -1) {
            sorted_events.push(event)
        }
    }

    return sorted_events
}
