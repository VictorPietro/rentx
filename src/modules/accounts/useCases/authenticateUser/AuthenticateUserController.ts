// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        // injeção de dependência
        const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

        const token = await authenticateUserUseCase.execute({ email, password });

        return response.json(token);
    }
}

export { AuthenticateUserController };
