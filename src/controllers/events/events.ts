import { response } from '../../utils';
import * as Types from '../../types';

import AWS from 'aws-sdk';

import { getEvents } from './methods/retrieve';
import { postEvent } from './methods/create';

export default function handler(ddb: AWS.DynamoDB, context: Types.Context): Promise<any> {
    if (context.method === Types.METHOD.GET) {
        return getEvents(ddb, context);
    }
    if (context.method === Types.METHOD.POST) {
        return postEvent(ddb, context);
    }
    return new Promise((resolve) => {
        resolve(response(405, 'WRONT PATH - GET OR POST AVAILABLE'));
    })
}