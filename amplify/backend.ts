import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource';
import { data } from './data/resource';

export const backend = defineBackend({
  myFirstFunction,
  data
});
