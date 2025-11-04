import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

const apiFunction = defineFunction({
  name: 'quizwiz-api',
  entry: '../quizwiz-app/backend/server.js'
});

export const backend = defineBackend({
  apiFunction
});
