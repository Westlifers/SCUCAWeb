import router from "@/router";

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
    if (validatedTimeStr == 'DNF' || validatedTimeStr == 'dnf' || validatedTimeStr == '') {
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
