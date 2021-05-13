import { Router } from 'express';
import multer from "multer";

import { CreateCategoryController } from '../modules/cars/useCases/createCategory/CreateCategoryController';
import { ListCategoriesController } from '../modules/cars/useCases/listCategories/ListCategoriesController';
import { ImportCategoryController } from '../modules/cars/useCases/importCategory/ImportCategoryController';

// rota: recebe requisição, chama o serviço e dá um retorno
const categoriesRoutes = Router();

const upload = multer({
    dest: "./tmp",
});

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const importCategoryController = new ImportCategoryController();

categoriesRoutes.post('/', createCategoryController.handle);
// isso é o mesmo que:
// categoriesRoutes.post('/', (request, response) => {
//     return createCategoryController().handle(request, response);
// });

categoriesRoutes.get('/', listCategoriesController.handle);

categoriesRoutes.post("/import", upload.single("file"), importCategoryController.handle);

export { categoriesRoutes };
