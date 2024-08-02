import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { isValidDateFormat } from './queryValidate';

// Define the validation rules for the query parameters
const validateQueryParams = [
    query('last-date')
        .optional()
        .isString()
        .custom((value) => {
            if (!isValidDateFormat(value)) {
                // Invalid date format, set today's date
                return new Date().toISOString().split('T')[0];
            }
            return value;
        })
        .withMessage('Invalid date format. Use YYYY-MM-DD.'),
    
    query('range')
        .optional()
        .isInt({min: 1, max: 20})
        
];

// Middleware function to validate the query parameters
export const galleryQueryValidate = (req: Request, res: Response, next: NextFunction) => {
    // Run the validation rules
    Promise.all(validateQueryParams.map((validator) => validator.run(req)))
        .then(() => {
            // Check for validation errors
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                // No validation errors, proceed to the next middleware
                next();
            } else {
                // Validation errors occurred, send a response with the errors
                res.status(400).json({ errors: errors.array() });
            }
        })
        .catch((error) => {
            // Handle any unexpected errors
            console.error('Error occurred during query validation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};