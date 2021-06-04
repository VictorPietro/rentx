// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        // injeção de dependência
        const listRentalsByUserUseCase = container.resolve(ListRentalsByUserUseCase);

        const rentals = await listRentalsByUserUseCase.execute({
            user_id: id,
        });

        return response.status(200).json(rentals);
    }
}

export { ListRentalsByUserController };
