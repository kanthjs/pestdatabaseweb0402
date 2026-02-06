import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standardized API error response helpers
 * Provides consistent error responses across all API routes
 */
export const apiErrors = {
    /**
     * 401 Unauthorized - User not authenticated
     */
    unauthorized: () => NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to access this resource" },
        { status: 401 }
    ),

    /**
     * 403 Forbidden - User lacks permission
     */
    forbidden: () => NextResponse.json(
        { error: "Forbidden", message: "You do not have permission to access this resource" },
        { status: 403 }
    ),

    /**
     * 404 Not Found - Resource does not exist
     * @param resource - Name of the resource (default: "Resource")
     */
    notFound: (resource = "Resource") => NextResponse.json(
        { error: "Not Found", message: `${resource} not found` },
        { status: 404 }
    ),

    /**
     * 400 Bad Request - Invalid request parameters
     * @param message - Custom error message
     */
    badRequest: (message = "Invalid request") => NextResponse.json(
        { error: "Bad Request", message },
        { status: 400 }
    ),

    /**
     * 400 Validation Error - Zod validation failed
     * @param issues - Zod error issues array
     */
    validationError: (issues: ZodError["issues"]) => NextResponse.json(
        { error: "Validation Error", message: "Invalid input data", issues },
        { status: 400 }
    ),

    /**
     * 429 Rate Limited - Too many requests
     * @param retryAfter - Seconds until retry is allowed
     */
    rateLimited: (retryAfter?: number) => NextResponse.json(
        { error: "Too Many Requests", message: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
    ),

    /**
     * 500 Internal Server Error - Unexpected error
     */
    internalError: () => NextResponse.json(
        { error: "Internal Server Error", message: "An unexpected error occurred" },
        { status: 500 }
    ),
};

/**
 * Handle API errors with appropriate responses
 * Automatically handles Zod validation errors and generic errors
 * @param error - The error to handle
 * @returns NextResponse with appropriate error status and message
 */
export function handleApiError(error: unknown): NextResponse {
    if (error instanceof ZodError) {
        return apiErrors.validationError(error.issues);
    }

    if (error instanceof Error) {
        // Log error in development only
        if (process.env.NODE_ENV === "development") {
            console.error("API Error:", error);
        }
    }

    return apiErrors.internalError();
}

/**
 * Create a standardized success response
 * @param data - Response data payload
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success flag and data
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ success: true, data }, { status });
}
