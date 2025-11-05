import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Simple API responses for QuizWiz
  const path = event.path;
  const method = event.httpMethod;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Mock API responses
  if (path.includes('/api/quiz/stats')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ totalQuizzes: 0, averageScore: 0 })
    };
  }

  if (path.includes('/api/test-sets/available')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }

  if (path.includes('/api/user/stats')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ quizzesTaken: 0, totalScore: 0 })
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  };
};
