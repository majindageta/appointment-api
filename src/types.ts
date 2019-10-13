import moment from 'moment';

//HANDLER
export enum METHOD {
    GET, 
    POST,
    PUT,
    PATCH,
    DELETE,
    WRONG_METHOD
}
export interface Context {
    path: string,
    resource: string,
    method: METHOD,
    eventId?: string,
    vendorId?: string,
    jwt?: string,
    day?: moment.Moment,
    body?: any
}

//DB
export interface Event {
    id: string,
    storeId: string,
    name: string,
    date: string,
    duration: number,
    saved: boolean,
    approved: boolean
}

export interface Store {
    id: string,
    user: string,
    name: string,
    defaultDuration: number,
    start: string,
    end: Date
}

//DTO

export interface DTOEvent {
    day: string,
    events: Event[]
}