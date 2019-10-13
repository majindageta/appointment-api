import { response } from '../../../utils';
import * as Types from '../../../types';
import { tableName, defaultDateFormat } from '../../../constants';
import AWS from 'aws-sdk';
import uuid from 'uuid';

export function postEvent(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        if (context.day) {
            const eventToCreate = context.body as Types.Event;
            eventToCreate.id = uuid.v4();
            const PK: string = context.vendorId + '_' + context.day.format(defaultDateFormat);
            const SK: string = context.jwt + '_' + context.eventId;
            let params: AWS.DynamoDB.PutItemInput = {
                TableName: tableName,
                Item: AWS.DynamoDB.Converter.marshall({
                    PK: PK,
                    SK: SK,
                    eventToCreate
                }),
                ReturnValues: 'ALL',
                ReturnConsumedCapacity: 'TOTAL'
            };
            ddb.putItem(params, (err, data: AWS.DynamoDB.PutItemOutput) => {
                if (data && data.Attributes) {
                    return resolve(response(data.Attributes ? 200 : 201, data.Attributes));
                }
                return resolve(response(500, 'Error creating event', err));
            });
        }
        return resolve(response(405, 'No day passed'));
    })
}