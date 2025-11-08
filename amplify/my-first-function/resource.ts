import { defineFunction } from "@aws-amplify/backend";

export const myFirstFunction = defineFunction({
  name: "quizwiz-api",
  entry: "./handler.ts",
  environment: {
    NODE_ENV: "production"
  }
});
