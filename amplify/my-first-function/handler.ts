import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
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

  // Health check endpoint
  if (path === '/test' || path === '/test/') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'QuizWiz API is running!',
        timestamp: new Date().toISOString(),
        path: path,
        method: method
      })
    };
  }

  // API endpoints
  if (path.includes('/api/test-sets/available')) {
    const query = event.queryStringParameters || {};
    console.log('Test sets query:', query);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        testSets: [],
        message: 'No test sets available yet - backend is working!',
        query: query
      })
    };
  }

  if (path.includes('/api/quiz/stats')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        totalQuizzes: 0, 
        averageScore: 0,
        message: 'Stats endpoint working!'
      })
    };
  }

  if (path.includes('/api/user/stats')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        quizzesTaken: 0, 
        totalScore: 0,
        message: 'User stats endpoint working!'
      })
    };
  }

  // Catch all for debugging
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      message: 'QuizWiz API endpoint received request',
      path: path,
      method: method,
      queryParams: event.queryStringParameters,
      headers: event.headers
    })
  };
};
