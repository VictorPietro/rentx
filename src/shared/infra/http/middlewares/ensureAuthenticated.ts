import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";

import { AppError } from "@shared/errors/AppError";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import auth from "@config/auth";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    const usersTokensRepository = new UsersTokensRepository();

    if (!authHeader) {
        throw new AppError("Token missing", 401);
    }

    // ignorando a posição 0 (Bearer)
    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id } = verify(token, auth.secret_refresh_token) as IPayload;

        const user = await usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if (!user) {
            throw new AppError("User does not exists!", 401);
        }

        // para poder fazer isso, precisa sobrescrever a interface do Request, o que é feito em src/@types/express/index.d.ts
        request.user = {
            id: user_id,
        };

        next();
    } catch {
        throw new AppError("Invalid token!", 401);
    }
}
