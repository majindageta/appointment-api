import { response } from '../../utils';
import * as Types from '../../types';

import AWS from 'aws-sdk';

import { getSingleEvent } from './methods/retrieve';
import { postEvent } from './methods/create';
import { deleteSingleEvent } from './methods/delete';

export default function handler(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        if (context.eventId) {
            if (context.path === Types.PATH.GET) {
                return getSingleEvent(ddb, context);
            }
            if (context.path === Types.PATH.PATCH ||
                context.path === Types.PATH.PUT) {
                return postEvent(ddb, context);
            }
            if (context.path === Types.PATH.DELETE) {
                return deleteSingleEvent(ddb, context);
            }
            return resolve(response(405, 'WRONT PATH - GET, PUT, DELETE, PATCH AVAILABLE'));
        }
        return resolve(response(405, 'No event id'));
    })
}