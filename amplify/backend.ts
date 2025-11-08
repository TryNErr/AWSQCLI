import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource';
import { data } from './data/resource';
import { api } from './api/resource';

export const backend = defineBackend({
  myFirstFunction,
  data,
  api
});
