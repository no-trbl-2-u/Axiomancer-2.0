import * as R from 'ramda';

/**
 * Functional utilities for the Axiomancer backend
 * These utilities provide common functional programming patterns
 */

// Type definitions for better type safety
export type AsyncPipe<T, U> = (input: T) => Promise<U>;
export type SyncPipe<T, U> = (input: T) => U;
export type Predicate<T> = (input: T) => boolean;
export type Validator<T> = (input: T) => string[];

// Async pipe composition - perfect for database operations
export const pipeAsync = <T>(...fns: Array<(input: any) => Promise<any>>) =>
  async (input?: T) => {
    let result = input;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  };

// Sync pipe composition using Ramda's pipe
export const pipe = R.pipe;
export const compose = R.compose;

// Error handling utilities
export const tryCatch = <T, E = Error>(
  fn: () => T,
  onError: (error: E) => T
): T => {
  try {
    return fn();
  } catch (error) {
    return onError(error as E);
  }
};

export const tryCatchAsync = <T, E = Error>(
  fn: () => Promise<T>,
  onError: (error: E) => Promise<T>
): Promise<T> =>
  fn().catch(onError);

// Validation composition utilities
export const validateAll = <T>(validators: Validator<T>[]): Validator<T> =>
  (input: T) => R.flatten(validators.map(validator => validator(input)));

export const isValid = <T>(validator: Validator<T>) =>
  (input: T): boolean => validator(input).length === 0;

// Common predicates
export const isNotEmpty = (str: string): boolean => Boolean(str && str.trim().length > 0);
export const isEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Field validation builders
export const validateRequired = (fieldName: string, value: any): string[] =>
  isNotEmpty(value) ? [] : [`${fieldName} is required`];

export const validateEmail = (email: string): string[] =>
  isEmail(email) ? [] : ['Invalid email format'];

export const validateMinLength = (fieldName: string, minLength: number) =>
  (value: string): string[] =>
    value && value.length >= minLength ? [] : [`${fieldName} must be at least ${minLength} characters`];

// Object transformation utilities
export const pick = R.pick;
export const omit = R.omit;
export const merge = R.mergeRight;
export const evolve = R.evolve;

// Array and collection utilities  
export const map = R.map;
export const filter = R.filter;
export const reduce = R.reduce;
export const find = R.find;
export const head = R.head;
export const isEmpty = R.isEmpty;
export const isNil = R.isNil;

// Transducer utilities
export const transducer = {
  map: R.map,
  filter: R.filter,
  take: R.take,
  drop: R.drop,
  partition: R.partition,
  groupBy: R.groupBy,
};

// Promise utilities for better async composition
export const promiseMap = <T, U>(fn: (item: T) => Promise<U>) =>
  (items: T[]): Promise<U[]> => Promise.all(items.map(fn));

export const promiseFilter = <T>(predicate: (item: T) => Promise<boolean>) =>
  async (items: T[]): Promise<T[]> => {
    const results = await Promise.all(items.map(predicate));
    return items.filter((_, index) => results[index]);
  };

// Maybe/Optional utilities for null handling
export const maybe = <T, U>(fn: (value: T) => U) =>
  (value: T | null | undefined): U | null =>
    value != null ? fn(value) : null;

export const maybeAsync = <T, U>(fn: (value: T) => Promise<U>) =>
  (value: T | null | undefined): Promise<U | null> =>
    value != null ? fn(value) : Promise.resolve(null);

// Curried utilities for partial application
export const curry = R.curry;
export const partial = R.partial;

// Point-free style helpers
export const prop = R.prop;
export const path = R.path;
export const propEq = R.propEq;
export const pathEq = R.pathEq;

// Higher-order functions for common patterns
export const ifElse = R.ifElse;
export const when = R.when;
export const unless = R.unless;
export const cond = R.cond;

// Logging utilities with functional composition
export const trace = R.curry((label: string, value: any) => {
  console.log(label, value);
  return value;
});

export const traceAsync = R.curry(async (label: string, value: any) => {
  console.log(label, await value);
  return value;
});