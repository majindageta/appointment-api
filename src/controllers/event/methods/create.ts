import { response } from '../../../utils';
import * as Types from '../../../types';
import { tableName, defaultDateFormat } from '../../../constants';
import AWS from 'aws-sdk';
import moment from 'moment';

//TODO: this should be a PUT so not putItem but UPDATE ITEM
export function postEvent(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        const eventToCreate = context.body as Types.Event;
        const momentDate = moment(eventToCreate.date)
        if (momentDate) {
            const eventToCreate = context.body as Types.Event;
            const PK: string = context.vendorId + '_' + momentDate.format(defaultDateFormat);
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
        return resolve(response(405, 'No day passed in body'));
    })
}