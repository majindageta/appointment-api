import { response } from '../../../utils';
import * as Types from '../../../types';
import { tableName, defaultDateFormat } from '../../../constants';
import AWS from 'aws-sdk';

export function getSingleEvent(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        if (!context.day) {
            return resolve(response(500, 'No day sent'));
        }
        let params: AWS.DynamoDB.GetItemInput = {
            TableName: tableName,
            Key: {
                'PK': { S: context.vendorId + '_' + context.day.format(defaultDateFormat) },
                'SK': { S: context.jwt + '_' + context.eventId }
            }
        };
        ddb.getItem(params, (err: AWS.AWSError, data: AWS.DynamoDB.GetItemOutput) => {
            if (data) {
                if (!data.Item) return resolve(response(404, 'No data found'));
                const event: Types.Event = AWS.DynamoDB.Converter.unmarshall(data.Item) as Types.Event;
                return resolve(response(200, event));
            }
            return resolve(response(500, 'error retrieving single event', err))            
        })
    })
}