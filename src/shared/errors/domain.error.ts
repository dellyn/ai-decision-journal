import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = "Forbidden access") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends BaseError {
  constructor(message: string = "Validation failed") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
} 