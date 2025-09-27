import * as R from 'ramda';

/**
 * Transducers for efficient data transformation in the Axiomancer backend
 * Transducers provide a way to compose transformations that can work with any data structure
 */

// Basic transducer operations using Ramda
export const { map: mapTransducer, filter: filterTransducer } = R;

// User data transformation transducers
export const sanitizeUserTransducer = R.map((user: any) => R.omit(['password'], user));

export const validateUsersTransducer = R.compose(
  R.filter((user: any) => user.email && user.firstName && user.lastName),
  R.map((user: any) => ({
    ...user,
    email: user.email?.toLowerCase?.() || user.email,
    firstName: user.firstName?.trim?.() || user.firstName,
    lastName: user.lastName?.trim?.() || user.lastName
  }))
);

// Email validation transducer
export const validateEmailsTransducer = R.filter(
  (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
);

// Error processing transducers
export const processErrorsTransducer = R.compose(
  R.filter((error: any) => error != null),
  R.map((error: any) => ({
    message: error.message || 'Unknown error',
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }))
);

// Authentication log processing transducer
export const processAuthLogsTransducer = R.compose(
  R.filter((log: any) => log.type === 'auth'),
  R.map((log: any) => ({
    userId: log.userId,
    action: log.action,
    timestamp: log.timestamp,
    success: log.success,
    ip: log.ip
  }))
);

// Database result transformation transducers
export const transformDatabaseResultsTransducer = R.compose(
  R.filter((result: any) => result != null),
  R.map((row: any) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  }))
);

// Request validation transducer
export const validateRequestsTransducer = R.compose(
  R.filter((request: any) => request.body != null),
  R.map((request: any) => ({
    ...request,
    body: {
      ...request.body,
      email: request.body.email?.toLowerCase?.() || request.body.email
    }
  }))
);

// Response transformation transducer
export const transformResponsesTransducer = R.map((response: any) => ({
  ...response,
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

// Pagination transducer
export const paginateTransducer = (page: number, limit: number) => 
  R.compose(
    R.take(limit),
    R.drop(page * limit)
  );

// Statistics gathering transducers
export const gatherStatsTransducer = R.compose(
  R.groupBy((item: any) => item.type),
  R.map((group: any[]) => group.length)
);

// Token processing transducers
export const processTokensTransducer = R.compose(
  R.filter((token: string) => token != null && token.length > 0),
  R.map((token: string) => token.replace('Bearer ', '')),
  R.filter((token: string) => token.length > 10) // Basic token validation
);

// Search result transducers
export const processSearchResultsTransducer = R.compose(
  R.filter((result: any) => result.relevance > 0.5),
  R.map((result: any) => ({
    ...result,
    score: result.relevance * 100,
    highlighted: true
  })),
  R.sortBy(R.prop('score')),
  R.reverse
);

// Utility functions for working with transducers
export const transduce = R.transduce;
export const into = R.into;

// Higher-order transducer for conditional processing
export const conditionalTransducer = <T>(
  predicate: (item: T) => boolean,
  trueTransducer: any,
  falseTransducer: any
) => R.map((item: T) => 
  predicate(item) ? trueTransducer(item) : falseTransducer(item)
);

// Async transducer support
export const asyncTransduce = async <T, U>(
  transducer: any,
  reducer: (acc: U[], curr: T) => Promise<U[]>,
  initial: U[],
  data: T[]
): Promise<U[]> => {
  let result = initial;
  for (const item of data) {
    result = await reducer(result, item);
  }
  return result;
};

// Example usage functions for the application
export const processUserBatch = (users: any[]) =>
  R.transduce(
    validateUsersTransducer,
    R.flip(R.append),
    [],
    users
  );

export const processAuthenticationLogs = (logs: any[]): any[] =>
  logs.filter(log => log.type === 'auth')
      .map(log => ({
        userId: log.userId,
        action: log.action,
        timestamp: log.timestamp,
        success: log.success,
        ip: log.ip
      }));

export const processValidationErrors = (errors: any[]) =>
  R.transduce(
    processErrorsTransducer,
    R.flip(R.append),
    [],
    errors
  );