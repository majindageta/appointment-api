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
        method: checkHttpMethod(proxyEvent.httpMethod),
        path: proxyEvent.path,
        resource: proxyEvent.resource,
        vendorId: checkHeader(proxyEvent, 'storeId') || storeIdMock,
        day: moment(checkPath(proxyEvent, 'day'), defaultDateFormat) || undefined,
        body: proxyEvent.body
    }
}

function checkHttpMethod(method: string): Types.METHOD {
    switch (method) {
        case 'GET':
            return Types.METHOD.GET;
        case 'POST':
            return Types.METHOD.POST;
        case 'PUT':
            return Types.METHOD.PUT;
        case 'PATCH':
            return Types.METHOD.PATCH;
        case 'DELETE':
            return Types.METHOD.DELETE;
        default:
            return Types.METHOD.GET;
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