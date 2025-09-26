export class AppError extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Validation failed", details) {
        super(message, 400, details);
    }
}

export class AuthenticationError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}

export class AuthorizationError extends AppError {
    constructor(message = "Not permitted") {
        super(message, 403);
    }
}
