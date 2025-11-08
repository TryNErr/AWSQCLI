import { defineHttpApi } from '@aws-amplify/backend';
import { myFirstFunction } from '../my-first-function/resource';

export const api = defineHttpApi({
  name: 'quizwiz-api',
  definition: {
    '/test': {
      methods: ['GET'],
      handler: myFirstFunction
    },
    '/api/{proxy+}': {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      handler: myFirstFunction
    }
  },
  cors: {
    allowOrigin: ['*'],
    allowHeaders: ['content-type', 'authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});
