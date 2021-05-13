import { container } from "tsyringe";

import { ICategoriesRepository } from "../../modules/cars/repositories/ICategoriesRepository";
import { CategoriesRepository } from "../../modules/cars/repositories/implementations/CategoriesRepository";
import { SpecificationsRepository } from "../../modules/cars/repositories/implementations/SpecificationsRepository";
import { ISpecificationRepository } from "../../modules/cars/repositories/ISpecificationsRepository";

// singleton é um padrão que garante a existência de uma única instância
// passa um nome "" e o repositório
container.registerSingleton<ICategoriesRepository>(
    "CategoriesRepository",
    CategoriesRepository
);

container.registerSingleton<ISpecificationRepository>(
    "SpecificationRepository",
    SpecificationsRepository
);
