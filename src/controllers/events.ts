import { response, contextBuilder } from '../utils';
import * as Types from '../types';
import { tableName, defaultDateFormat } from '../constants';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import moment from 'moment';

export function handler(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve, reject) => {
        if (context.path === Types.PATH.GET) {
            return
        }
        if (context.path === Types.PATH.POST) {
            return
        }
        return resolve(response(405, 'WRONT PATH - GET OR POST AVAILABLE'));
    })
}

function getEvents(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    if (context.day) {
        return queryEventForDay(ddb, context, context.day);
    } else {
        return new Promise((resolve, reject) => {
            const queryEventArray: Promise<any>[] = [];
            for (let i = 0; i < 14; i++) {
                queryEventArray.push(queryEventForDay(ddb, context, moment().add(i, 'days')));
            }
            Promise.all(queryEventArray).then(result => {
                resolve(response(200, result))
            }).catch(error => {
                resolve(response(500, 'Error during query for 14 days', error));
            })
        })
    }
}

function queryEventForDay(ddb: AWS.DynamoDB, context: Types.Context, momentDay: moment.Moment): Promise<any> {
    return new Promise((resolve, reject) => {
        let params: AWS.DynamoDB.QueryInput = {
            TableName: tableName,
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': { S: context.vendorId + '_' + momentDay.format(defaultDateFormat) },
                ':sk': { S: context.jwt }
            }
        }
        ddb.query(params, async (err, data) => {
            if (err || !data) {
                return resolve(response(500, undefined, err));
            }
            if (data && data.Items) {
                const events: Types.Event[] = data.Items.map(event => AWS.DynamoDB.Converter.unmarshall(event) as Types.Event);
                let result: Types.DTOEvent = {
                    day: momentDay.format(defaultDateFormat),
                    events: events
                };
                return resolve(response(200, result));
            }
        });
    })
}