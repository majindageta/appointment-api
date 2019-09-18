import moment from 'moment';
import * as Types from './types';
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
    return {
        eventId: checkPath(proxyEvent, 'eventId'),
        jwt: checkHeader(proxyEvent, 'jwt'),
        method: proxyEvent.httpMethod,
        path: proxyEvent.path,
        storeId: checkPath(proxyEvent, 'storeId')
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

function checkQueryString(event: APIGatewayProxyEvent, key: string): string| undefined {
    if (event.queryStringParameters && Object.keys(event.queryStringParameters).length !== 0) {
        return event.queryStringParameters[key];
    }
    return undefined;
}