import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';

export default function (req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    try {
        const decoded = Jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
        console.log(decoded)
        req.user = (decoded as Jwt.JwtPayload).userId;
        console.log(req.user)
        return next();
    } catch (error) {
        return res.status(500).json({message: "Error with data", error: error})
    }
    
    return res.status(401).json({ message: 'Unauthorized' });
}
