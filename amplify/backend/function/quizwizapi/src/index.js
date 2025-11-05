const serverlessExpress = require('aws-serverless-express');
const app = require('../../../../../../quizwiz-app/backend/server.js');

const server = serverlessExpress.createServer(app);

exports.handler = (event, context) => {
  return serverlessExpress.proxy(server, event, context);
};
