import { z } from 'zod'

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] }

/**
 * Validation error type
 */
export interface ValidationError {
  path: string
  message: string
  code?: string
}

/**
 * Validate data against a Zod schema
 */
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  }

  return {
    success: false,
    errors: result.error.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  }
}

/**
 * Validate and throw on error
 */
export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = validate(schema, data)

  if (!result.success) {
    const errorMessages = result.errors.map((err) => `${err.path}: ${err.message}`).join(', ')
    throw new Error(`Validation failed: ${errorMessages}`)
  }

  return result.data
}

/**
 * Format validation errors for API response
 */
export function formatValidationErrors(errors: ValidationError[]): {
  message: string
  errors: ValidationError[]
} {
  return {
    message: 'Validation failed',
    errors,
  }
}
