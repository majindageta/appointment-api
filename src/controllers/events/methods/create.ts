import { response } from '../../../utils';
import * as Types from '../../../types';
import { tableName, defaultDateFormat } from '../../../constants';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import moment from 'moment';

export function postEvent(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        const eventToCreate = context.body as Types.Event;
        const momentDate = moment(eventToCreate.date);
        if (momentDate) {
            eventToCreate.id = uuid.v4();
            const PK: string = context.vendorId + '_' + momentDate.format(defaultDateFormat);
            const SK: string = context.jwt + '_' + eventToCreate.id;
            let params: AWS.DynamoDB.PutItemInput = {
                TableName: tableName,
                Item: AWS.DynamoDB.Converter.marshall({
                    PK: PK,
                    SK: SK,
                    ...eventToCreate
                }),
                ReturnValues: 'ALL_OLD',
                ReturnConsumedCapacity: 'TOTAL'
            };
            ddb.putItem(params, (err, data: AWS.DynamoDB.PutItemOutput) => {
                if (data) {
                    return resolve(response(data.Attributes ? 200 : 201, data.Attributes));
                }
                return resolve(response(500, 'Error creating event', err));
            });
        }
        else return resolve(response(405, 'No day passed in body: ' + moment(eventToCreate.date).toDate().toISOString()));
    })
}