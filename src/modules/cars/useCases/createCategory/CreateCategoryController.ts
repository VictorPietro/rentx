// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, description } = request.body;

        // injeção de dependência
        const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

        await createCategoryUseCase.execute({ name, description });

        return response.status(201).send();
    }
}

export { CreateCategoryController };
