import { response } from '../../utils';
import * as Types from '../../types';

import AWS from 'aws-sdk';

import { getEvents } from './methods/retrieve';
import { postEvent } from './methods/create';

export default function handler(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    return new Promise((resolve) => {
        if (context.path === Types.PATH.GET) {
            return getEvents(ddb, context);
        }
        if (context.path === Types.PATH.POST) {
            return postEvent(ddb, context);
        }
        return resolve(response(405, 'WRONT PATH - GET OR POST AVAILABLE'));
    })
}