import { defineData } from '@aws-amplify/backend';

export const data = defineData({
  schema: `
    type Question @model {
      id: ID!
      subject: String!
      grade: String!
      difficulty: String!
      question: String!
      options: [String!]!
      correctAnswer: String!
      explanation: String
    }

    type Quiz @model {
      id: ID!
      userId: String!
      score: Int!
      totalQuestions: Int!
      completedAt: AWSDateTime!
    }

    type User @model {
      id: ID!
      email: String!
      name: String!
      totalQuizzes: Int!
      averageScore: Float!
    }
  `,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});
