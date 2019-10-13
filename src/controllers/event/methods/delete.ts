import { response } from '../../../utils';
import * as Types from '../../../types';
import { tableName, defaultDateFormat } from '../../../constants';
import AWS from 'aws-sdk';

export function deleteSingleEvent(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        if (!context.day) {
            return resolve(response(500, 'No day sent'));
        }
        let params: AWS.DynamoDB.DeleteItemInput = {
            TableName: tableName,
            Key: {
                'PK': { S: context.vendorId + '_' + context.day.format(defaultDateFormat) },
                'SK': { S: context.jwt + '_' + context.eventId }
            }
        };
        ddb.deleteItem(params, (err: AWS.AWSError, data: AWS.DynamoDB.GetItemOutput) => {
            if (err) return resolve(response(500, 'error deleting single event', err))
            return resolve(response(200, 'Delete successfull'));        
        })
    })
}