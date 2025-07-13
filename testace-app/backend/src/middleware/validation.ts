import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profile: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    grade: Joi.string().optional(),
    subjects: Joi.array().items(Joi.string()).optional(),
    targetTests: Joi.array().items(Joi.string()).optional()
  }).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const questionSchema = Joi.object({
  content: Joi.string().required(),
  type: Joi.string().valid('multiple_choice', 'true_false', 'fill_blank', 'essay', 'math').required(),
  subject: Joi.string().required(),
  topic: Joi.string().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  options: Joi.array().items(Joi.string()).optional(),
  correctAnswer: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  explanation: Joi.string().required(),
  hints: Joi.array().items(Joi.string()).optional(),
  timeLimit: Joi.number().min(10).max(600).optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

export const sessionSchema = Joi.object({
  mode: Joi.string().valid('practice', 'timed', 'daily_challenge').required(),
  subject: Joi.string().optional(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
  timeLimit: Joi.number().min(60).max(7200).optional(),
  questionCount: Joi.number().min(1).max(100).optional()
});

export const answerSchema = Joi.object({
  questionId: Joi.string().required(),
  answer: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  timeSpent: Joi.number().min(0).required()
});

export const writingSubmissionSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().max(10000).required(),
  type: Joi.string().valid('essay', 'paragraph', 'creative', 'argumentative').required()
});
