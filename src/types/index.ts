export interface User {
    id: number,
    username: string,
    email: string,
    is_active: boolean,
    is_superuser?: boolean,
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
    best: number
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
