import { 
  pipe, 
  validateAll, 
  validateRequired, 
  validateEmail, 
  validateMinLength,
  isValid,
  curry,
  filter,
  isEmpty
} from './functional.utils';
import { 
  processValidationErrors,
  validateEmailsTransducer,
  transduce
} from './transducers.utils';
import { UserCreateInput, UserLoginInput } from '../types';

/**
 * Validation utilities using functional composition
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Create validation result
export const createValidationResult = curry(
  (errors: string[]): ValidationResult => ({
    isValid: isEmpty(errors),
    errors
  })
);

// User registration validation using transducers and composition
export const validateUserRegistration = pipe(
  (userData: UserCreateInput) => [
    validateRequired('Email', userData.email),
    validateRequired('Password', userData.password),
    validateRequired('First Name', userData.firstName),
    validateRequired('Last Name', userData.lastName),
    validateEmail(userData.email),
    validateMinLength('Password', 6)(userData.password)
  ],
  filter((errors: string[]) => !isEmpty(errors)),
  (validationResults: string[][]) => validationResults.flat(),
  createValidationResult
);

// User login validation
export const validateUserLogin = pipe(
  (credentials: UserLoginInput) => [
    validateRequired('Email', credentials.email),
    validateRequired('Password', credentials.password),
    validateEmail(credentials.email)
  ],
  filter((errors: string[]) => !isEmpty(errors)),
  (validationResults: string[][]) => validationResults.flat(),
  createValidationResult
);

// Generic request validation wrapper
export const validateRequest = <T>(validator: (data: T) => ValidationResult) =>
  (data: T): ValidationResult => validator(data);

// Validation middleware creator
export const createValidator = <T>(validationFn: (data: T) => ValidationResult) =>
  (data: T) => {
    const result = validationFn(data);
    if (!result.isValid) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }
    return data;
  };

// Specific validators for use in controllers
export const validateRegistrationData = createValidator(validateUserRegistration);
export const validateLoginData = createValidator(validateUserLogin);

// Batch validation using transducers
export const validateMultipleRegistrations = (registrations: UserCreateInput[]): ValidationResult[] =>
  registrations.map(validateUserRegistration);

export const validateMultipleEmails = (emails: string[]): string[] =>
  emails.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

export const processValidationErrorsBatch = (errors: any[]): any[] =>
  processValidationErrors(errors);