import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
            req['jwtPayload'] = payload;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}