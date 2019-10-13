import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';

import { response, contextBuilder } from './utils';
import { Context } from './types';

import eventsHandler from './controllers/events/events';

const credentials = new AWS.SharedIniFileCredentials({ profile: 'personal' });
AWS.config.update({
	region: 'eu-west-1',
	credentials: credentials,
});
const ddb = new AWS.DynamoDB();

export const hello: APIGatewayProxyHandler = async (event, _context) => {

	const context: Context = contextBuilder(event);

	// if (context.method === 'login') {
	// 	//login
	// }
	if (context.resource === '/events') {
		//events get e post
		//get all events
		//post all events
		return eventsHandler(ddb, context);
	}

	if (context.resource === '/events/day/{day}') {
		//events get e post
		if (context.day) {
			return eventsHandler(ddb, context);
		} else {
			return response(404, 'No event id passed');
		}
	}

	if (context.resource === '/events/{eventId}') {
		//events get e post
		if (context.eventId) {
			return eventsHandler(ddb, context);
		} else {
			return response(404, 'No event id passed');
		}
	}

	// if (context.path.startsWith('store')) {
	// 	//store
	// 	//store/id
	// }

	//user will
	//login, check their event, modify event, delete, post

	//owner will
	//login, check event of their shop, accept event, deny event

	//DB
	//user will log in with JWT: client will have secret saved, will create JWT with payload user and password
	//will send token to client, client will use token to login

	//USER: pk = mail sk: registration_date, active_token?
	//token pk = mail sk: token, ttl 15 days
	//every action will have in the header the token, server will check token if not present, will check mail
	//if not token but mail, user should login again, if nothing then register
	// so the server will always check 1 parameter, 2 if need login
	// client will always receive the 403 if user not logged, 401 if not authorized (need registration)

	//STORE pk = STORE sk = token, id, name, address or whatever
	//STORE, Secondary index: pk = STORE, sk = id

	//event pk: toke  sk: STORE_storeId 
	// the user will look for store in the client, selecting a store can create an event with the store id and their token
	// after the event is created an user can look up for the store with token

	// when an event is created, a trigger on dynamo will "trigger" a notification to the store owner 


	return response(200, 'OK');
}