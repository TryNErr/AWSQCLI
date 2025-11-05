import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

const apiFunction = defineFunction({
  name: 'quizwiz-api',
  entry: '../quizwiz-app/backend/server.js',
  runtime: 'nodejs18.x'
});

export const backend = defineBackend({
  apiFunction
});
