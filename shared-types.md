# Shared Types Between Frontend and Backend

This document tracks types that exist in both the frontend and backend codebases and highlights any mismatches.

## Overview

The frontend and backend share several authentication-related types. These should match exactly to ensure proper communication between client and server.

---

## 1. User Type

### Frontend Definition
**Location**: `axiomancer-frontend/src/types/index.ts`
```typescript
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
```

### Backend Definition
**Location**: `axiomancer-backend/src/types/index.ts`
```typescript
export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Differences
1. **password field**: Backend has it, frontend doesn't (✅ **CORRECT** - frontend should never receive password)
2. **Date types**: Backend uses `Date`, frontend uses `string` (✅ **CORRECT** - JSON serialization converts Date to string)

### Status
✅ **NO ACTION NEEDED** - These differences are intentional and correct:
- Password should never be sent to frontend
- Dates are serialized as strings in JSON

### Recommendation
Consider using `Omit<User, 'password'>` in backend AuthResponse to make this explicit:
```typescript
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}
```

---

## 2. AuthResponse Type

### Frontend Definition
**Location**: `axiomancer-frontend/src/types/index.ts`
```typescript
export interface AuthResponse {
  user: User;
  token: string;
}
```

### Backend Definition
**Location**: `axiomancer-backend/src/types/index.ts`
```typescript
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}
```

### Differences
Backend explicitly uses `Omit<User, 'password'>` while frontend just uses `User`

### Status
✅ **MATCH** - Frontend User doesn't have password anyway, so this is functionally equivalent

### Recommendation
No action needed, but good practice to be explicit

---

## 3. ApiError Type

### Frontend Definition
**Location**: `axiomancer-frontend/src/types/index.ts`
```typescript
export interface ApiError {
  error: string;
  stack?: string;
}
```

### Backend Definition
**Location**: `axiomancer-backend/src/types/index.ts`
```typescript
export interface ApiError {
  message: string;
  statusCode: number;
  stack?: string;
}
```

### Differences
1. **Property name**: Frontend uses `error`, backend uses `message`
2. **statusCode**: Backend has it, frontend doesn't

### Status
❌ **MISMATCH** - This will cause issues!

### Impact
When backend sends an error like:
```typescript
{ message: "Invalid credentials", statusCode: 401 }
```

Frontend expects:
```typescript
{ error: "Invalid credentials" }
```

This could cause runtime errors or undefined behavior.

### Recommendation
**Fix this mismatch!** Two options:

**Option 1: Align to Backend** (Recommended)
```typescript
// Frontend types/index.ts
export interface ApiError {
  message: string;
  statusCode: number;
  stack?: string;
}
```

**Option 2: Align to Frontend**
```typescript
// Backend types/index.ts
export interface ApiError {
  error: string;
  statusCode: number;
  stack?: string;
}
```

I recommend **Option 1** because:
- `message` is more standard for errors
- `statusCode` is useful information for the frontend

---

## 4. Login/Register Types

### Frontend: LoginCredentials
**Location**: `axiomancer-frontend/src/types/index.ts`
```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}
```

### Backend: UserLoginInput
**Location**: `axiomancer-backend/src/types/index.ts`
```typescript
export interface UserLoginInput {
  email: string;
  password: string;
}
```

### Status
✅ **MATCH** - Same structure, just different names (which is fine)

---

### Frontend: RegisterData
**Location**: `axiomancer-frontend/src/types/index.ts`
```typescript
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

### Backend: UserCreateInput
**Location**: `axiomancer-backend/src/types/index.ts`
```typescript
export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

### Status
✅ **MATCH** - Same structure, just different names (which is fine)

---

## 5. JwtPayload Type

### Frontend Definition
Does not exist in frontend

### Backend Definition
**Location**: `axiomancer-backend/src/types/index.ts`
```typescript
export interface JwtPayload {
  userId: number;
  email: string;
}
```

### Status
✅ **CORRECT** - This is backend-only, no need for frontend to know about JWT internals

---

## Summary of Actions Required

| Type | Status | Action |
|------|--------|--------|
| User | ✅ Match | No action - intentional differences |
| AuthResponse | ✅ Match | No action |
| ApiError | ❌ Mismatch | **FIX REQUIRED** - Align property names |
| LoginCredentials / UserLoginInput | ✅ Match | No action |
| RegisterData / UserCreateInput | ✅ Match | No action |
| JwtPayload | ✅ Correct | No action - backend only |

---

## Recommendations for Future

### 1. Consider a Shared Types Package
For a monorepo, consider creating a shared types package:
```
axiomancer-types/
  ├── auth.ts
  ├── errors.ts
  └── index.ts
```

Both frontend and backend would import from this shared package, ensuring types always match.

### 2. Add Type Validation
Consider using a runtime validation library like Zod to ensure frontend and backend types match at runtime:
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
```

### 3. API Contract Testing
Add tests that validate the API responses match the expected frontend types.

---

## Implementation Priority

1. **HIGH**: Fix ApiError mismatch
2. **MEDIUM**: Consider using Omit<User, 'password'> explicitly in backend
3. **LOW**: Consider shared types package for future

---

## Related Files to Modify

When fixing ApiError mismatch:
- ✅ `/axiomancer-frontend/src/types/index.ts`
- ❓ Any frontend code that uses `error.error` should be updated to `error.message`
- ❓ Check error handling in auth service, login/register pages
