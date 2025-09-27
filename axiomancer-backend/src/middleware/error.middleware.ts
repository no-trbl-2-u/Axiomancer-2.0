import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import { 
  pipe, 
  ifElse, 
  prop, 
  merge,
  when
} from '../utilities/functional.utils';

// Functional error processing
const logError = (error: Error | ApiError): Error | ApiError => {
  console.error('Error:', error);
  return error;
};

const extractStatusCode = ifElse(
  (error: Error | ApiError) => 'statusCode' in error,
  prop('statusCode'),
  () => 500
);

const extractMessage = (error: Error | ApiError): string => 
  error.message || 'Internal Server Error';

const createErrorResponse = (error: Error | ApiError) => {
  const baseResponse = { error: extractMessage(error) };
  if (process.env.NODE_ENV === 'development') {
    return merge(baseResponse, { stack: error.stack });
  }
  return baseResponse;
};

const sendErrorResponse = (error: Error | ApiError, res: Response): void => {
  const statusCode = extractStatusCode(error);
  const errorResponse = createErrorResponse(error);
  res.status(statusCode).json(errorResponse);
};

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const processError = pipe(
    logError,
    (error: Error | ApiError) => sendErrorResponse(error, res)
  );

  processError(error);
};