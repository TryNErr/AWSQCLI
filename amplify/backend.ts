import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource';
import { data } from './data/resource';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';

export const backend = defineBackend({
  myFirstFunction,
  data
});

// Enable function URL for direct HTTP access
backend.myFirstFunction.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowCredentials: false,
    allowHeaders: ['*'],
    allowMethods: ['*'],
    allowOrigins: ['*'],
    maxAge: Duration.days(1)
  }
});
