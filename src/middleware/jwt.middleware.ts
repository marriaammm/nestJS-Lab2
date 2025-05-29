import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../lib/interfaces';

declare global {
    namespace Express {
        interface Request {
            jwtPayload?: JWTPayload;
        }
    }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const authHeader: string | undefined = req.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header provided');
        }

        const token: string | undefined = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as JWTPayload;
            req.jwtPayload = payload;
            next();
        } catch (err: unknown) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}