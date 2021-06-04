// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

class DevolutionRentalController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const { id: user_id } = request.user;

        // injeção de dependência
        const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);

        const rental = await devolutionRentalUseCase.execute({
            id,
            user_id,
        });

        return response.status(200).json(rental);
    }
}

export { DevolutionRentalController };
