import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

// Define the validation rules for the query parameters
const validateQueryParams = [
    body('apodId')
        .isInt({min: 1})
];

// Middleware function to validate the query parameters
export const ratePostQueryValidate = (req: Request, res: Response, next: NextFunction) => {
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