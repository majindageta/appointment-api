import { hello } from './handler';
import moment = require('moment');


const prova = moment('20191013T220111+0200');

const event: any = {"resource":"/events", "body":
JSON.stringify({
    "name": "prova1",
    "date": "20191013T220111+0200",
    "duration": 30,
    "saved": true
}), "path":"/events","httpMethod":"GET","headers":null,"multiValueHeaders":null,"queryStringParameters":null,"multiValueQueryStringParameters":null,"pathParameters":null,"stageVariables":null,"requestContext":{"resourceId":"wt8vxg","resourcePath":"/events","httpMethod":"POST","extendedRequestId":"BhFiOGfLjoEFfGw=","requestTime":"13/Oct/2019:20:02:34 +0000","path":"/events","accountId":"402961833847","protocol":"HTTP/1.1","stage":"test-invoke-stage","domainPrefix":"testPrefix","requestTimeEpoch":1570996954989,"requestId":"e7468810-751c-4d2a-84aa-7bbb9f67dff0","identity":{"cognitoIdentityPoolId":null,"cognitoIdentityId":null,"apiKey":"test-invoke-api-key"}}};

hello(event, undefined, undefined);