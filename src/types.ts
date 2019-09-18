
export interface Context {
    path: string,
    method: string,
    eventId?: string,
    storeId?: string,
    jwt?: string
}

export interface Event {
    id: string,
    storeId: string,
    name: string,
    date: Date,
    duration: number,
    saved: boolean,
    approved: boolean
}

export interface Store {
    id: string,
    user: string,
    name: string,
    defaultDuration: number,
    start: Date,
    end: Date
}