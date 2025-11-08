import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource';
import { data } from './data/resource';

export const backend = defineBackend({
  myFirstFunction,
  data
});

// Enable function URL for direct HTTP access
backend.myFirstFunction.resources.lambda.addFunctionUrl({
  authType: 'NONE',
  cors: {
    allowCredentials: false,
    allowHeaders: ['*'],
    allowMethods: ['*'],
    allowOrigins: ['*'],
    maxAge: 86400
  }
});
