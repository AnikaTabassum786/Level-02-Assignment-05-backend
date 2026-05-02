/* eslint-disable @typescript-eslint/no-namespace */
import { auth as betterAuth } from '../app/lib/auth'
import { NextFunction, Request, Response } from "express";


export enum Role {
    SELLER = "SELLER",
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean
            }
        }
    }
}

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //   console.log(roles)
        const session = await betterAuth.api.getSession({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headers: req.headers as any
        })

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized"
            })
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        }

        if (roles.length && !roles.includes(req.user.role as Role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden! You don't have permission to access this resources!"
            })
        }
        next()

        console.log(session)
    }
}

export default auth