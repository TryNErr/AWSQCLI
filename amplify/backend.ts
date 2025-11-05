import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';

const apiFunction = defineFunction({
  entry: '../quizwiz-app/backend/server.js'
});

export const backend = defineBackend({
  apiFunction
});

// Create REST API Gateway with Lambda integration
const apiStack = backend.createStack('api-stack');

const restApi = new RestApi(apiStack, 'QuizWizApi', {
  restApiName: 'QuizWiz API',
  description: 'REST API for QuizWiz application',
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key']
  }
});

const lambdaIntegration = new LambdaIntegration(backend.apiFunction.resources.lambda);

// Add proxy resource to handle all routes
restApi.root.addProxy({
  defaultIntegration: lambdaIntegration,
  anyMethod: true
});

// Add outputs for frontend to use
backend.addOutput({
  custom: {
    API: {
      QuizWizApi: {
        endpoint: restApi.url,
        region: apiStack.region
      }
    }
  }
});
