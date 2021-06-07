import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayload {
    sub: string;
    email: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(token: string): Promise<string> {
        // 1. recebeu as informações do token
        const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;

        const user_id = sub;

        // 2. verifica se o refresh token existe e é válido
        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if (!userToken) {
            throw new AppError("Refresh Token does not exist!");
        }

        // 3. se existir, remove o anterior do BD
        await this.usersTokensRepository.deleteById(userToken.id);

        // 4. e gera um novo refresh token
        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token
        });

        const expiration_date = this.dateProvider.addDays(auth.expiration_refresh_token_days);

        await this.usersTokensRepository.create({
            user_id,
            refresh_token,
            expiration_date
        });

        return refresh_token;
    }
}

export { RefreshTokenUseCase };
