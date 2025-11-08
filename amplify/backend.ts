import { defineBackend } from '@aws-amplify/backend';
import { myFirstFunction } from './my-first-function/resource.js';
import { data } from './data/resource.js';

export const backend = defineBackend({
  myFirstFunction,
  data
});
