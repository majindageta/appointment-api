import { response } from '../../../utils';
import * as Types from '../../../types';
import { tableName, defaultDateFormat } from '../../../constants';
import AWS from 'aws-sdk';
import moment from 'moment';

export async function getEvents(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise(async (resolve) => {
        if (context.day) {
            try {
                const result: Types.DTOEvent = await queryEventForDay(ddb, context, context.day);
                return resolve(response(200, result));
            } catch (error) {
                return resolve(response(500, 'Error retrieving data', error));
            }
        } else {
            const queryEventArray: Promise<any>[] = [];
            for (let i = 0; i < 14; i++) {
                queryEventArray.push(queryEventForDay(ddb, context, moment().add(i, 'days')));
            }
            Promise.all(queryEventArray).then(result => {
                resolve(response(200, result))
            }).catch(error => {
                resolve(response(500, 'Error during query for 14 days', error));
            })
        }
    })
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
            if (data && data.Items) {
                const events: Types.Event[] = data.Items.map(event => AWS.DynamoDB.Converter.unmarshall(event) as Types.Event);
                let result: Types.DTOEvent = {
                    day: momentDay.format(defaultDateFormat),
                    events: events
                };
                return resolve(result);
            }
            return reject(err);
        });
    })
}
