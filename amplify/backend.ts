import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource';
import { data } from './data/resource';

export const backend = defineBackend({
  myFirstFunction,
  data
});

// Add API Gateway configuration
backend.myFirstFunction.addHttpApi({
  path: '/api/{proxy+}',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

backend.myFirstFunction.addHttpApi({
  path: '/test',
  methods: ['GET']
});
