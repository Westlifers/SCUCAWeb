export interface User {
    id: number,
    username: string,
    email: string,
    is_active: boolean,
    is_superuser?: boolean,
    avatar: string,
    is_scuer: boolean,
    description: string,
}


export interface Result {
    username: string,
    event: string,
    time_1: number,
    time_2: number,
    time_3: number,
    time_4: number,
    time_5: number,
    avg: number,
    best: number,
    is_avg_scur: boolean,
    is_best_scur: boolean
}


export interface OmittedCompetition {
    compId: string,
    is_normal: boolean,
    ongoing: boolean,
    user_count: number,
    event_count: number
}


export interface Scramble {
    event: string,
    scramble_1: string,
    scramble_2: string,
    scramble_3: string,
    scramble_4: string,
    scramble_5: string
}


export interface DetailedCompetition extends OmittedCompetition{
    result_set: Result[],
    scramble_set: Scramble[]
}


interface OmittedResult {
    event: string
    username: string
    date: string
}


export interface OmittedResultAvg extends OmittedResult {
    avg: number
}


export interface OmittedResultBest extends OmittedResult {
    best: number
}


export interface Record {
    avg: OmittedResultAvg[]
    best: OmittedResultBest[]
}


export interface OmittedResultAvgWithCompId extends OmittedResultAvg {
    compId: string
}


export interface OmittedResultBestWithCompId extends OmittedResultBest {
    compId: string
}


export interface RankPaginationData {
    count: number,
    results: OmittedResultAvgWithCompId[] | OmittedResultBestWithCompId[],
    current: number
}


interface SingleParticipationData {
    events_all: string[],
    events_finished: string[]
}


export interface UserParticipationData {
    week: SingleParticipationData
    special: SingleParticipationData
}


export interface Announcement {
    title: string
    content: string
    date: string
    author: string
    type: string
}


export interface Score {
    username: string
    score: number
}


export interface StoredTime {
    time: number
    scramble: string
    date: number  // timestamp
    note: string
    punishment: number  // 0: no punishment, -1: DNF, positive: 2, 4, etc.
}
