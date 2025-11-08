import { defineFunction } from "@aws-amplify/backend";

export const myFirstFunction = defineFunction({
  name: "quizwiz-api",
  entry: "./handler.ts",
  runtime: 18,
  timeout: 30
});
