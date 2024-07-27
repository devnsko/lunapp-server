import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';

// Define the validation rules for the query parameters
const validateQueryParams = [
    query('date')
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
    
    query('year')
        .optional()
        .isInt()
        .custom((value) => {
            if (value < 1900 || value > new Date().getFullYear()) {
                // Invalid year, set the current year
                return new Date().getFullYear();
            }
            return value;
        })
];

// Middleware function to validate the query parameters
export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
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

export const isValidDateFormat = (date: string): boolean => {
    // Regular expression to match YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
        return false;
    }

    // Parse the date and check if it is valid
    const parsedDate = new Date(date);
    const [year, month, day] = date.split('-').map(Number);
    
    // Check if the parsed date components match the input components
    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() + 1 !== month || // getMonth() returns month index starting from 0
        parsedDate.getDate() !== day
    ) {
        return false;
    }

    return true;
}