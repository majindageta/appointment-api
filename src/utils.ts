import moment from 'moment';
import hash from 'object-hash';
import * as Types from './types';
import { defaultDateFormat } from './constants';
import { APIGatewayProxyEvent } from 'aws-lambda';

export function getISODate(date: Date) {
    return moment(date).format();
}

export function response(statusCode: number, body: any, error: Error | undefined = undefined) {
    if (error) {
        body = {
            errorMessage: error.message,
            errorName: error.name,
            errorStack: error.stack,
            previousMessage: body
        }
    }
    return {
        statusCode: statusCode,
        body: JSON.stringify(body)
    };
}

export function contextBuilder(proxyEvent: APIGatewayProxyEvent): Types.Context {
    //MOCK
    //STORE ID not yet present, for now we put a mock value
    const storeIdMock = 'BARBIERE';
    //JWT not present, no logic added to create user
    const jwtMock = hash({tel: '123', device: 'asd'});
    return {
        eventId: checkPath(proxyEvent, 'eventId'),
        jwt: checkHeader(proxyEvent, 'jwt') || jwtMock,
        method: proxyEvent.httpMethod,
        path: checkHttpPath(proxyEvent.path),
        resource: proxyEvent.resource,
        vendorId: checkPath(proxyEvent, 'storeId') || storeIdMock,
        day: moment(checkPath(proxyEvent, 'day'), defaultDateFormat) || moment()
    }
}

function checkHttpPath(path: string): Types.PATH {
    switch (path) {
        case 'GET':
            return Types.PATH.GET;
        case 'POST':
            return Types.PATH.POST;
        case 'PUT':
            return Types.PATH.PUT;
        case 'PATCH':
            return Types.PATH.PATCH;
        case 'DELETE':
            return Types.PATH.DELETE;
        default:
            return Types.PATH.GET;
    }
}
function checkHeader(event: APIGatewayProxyEvent, key: string): string | undefined {
    if (event.headers && Object.keys(event.headers).length !== 0 && event.headers[key]) {
        return event.headers[key] as string;
    }
    return undefined;
}

function checkPath(event: APIGatewayProxyEvent, key: string): string | undefined {
    if (event.pathParameters && Object.keys(event.pathParameters).length !== 0) {
        return event.pathParameters[key];
    }
    return undefined;
}

function checkQueryString(event: APIGatewayProxyEvent, key: string): string | undefined {
    if (event.queryStringParameters && Object.keys(event.queryStringParameters).length !== 0) {
        return event.queryStringParameters[key];
    }
    return undefined;
}