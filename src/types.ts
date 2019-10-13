import moment from 'moment';

//HANDLER
export enum PATH {
    GET, 
    POST,
    PUT,
    PATCH,
    DELETE
}
export interface Context {
    path: PATH,
    resource: string,
    method: string,
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

//DTO

export interface DTOEvent {
    day: string,
    events: Event[]
}