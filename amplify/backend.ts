import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource';

export const backend = defineBackend({
  myFirstFunction
});

// Add function URL to make it accessible via HTTP
backend.myFirstFunction.resources.lambda.addFunctionUrl({
  authType: 'NONE'
});
