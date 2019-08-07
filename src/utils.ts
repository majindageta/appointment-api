import moment from 'moment';

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