import { Request, Response } from 'express';
import { ApiError } from '../types';

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response
): void => {
  console.error('Error:', error);

  const statusCode = 'statusCode' in error ? error.statusCode : 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};