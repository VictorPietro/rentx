import fs from "fs";
import csvParse from "csv-parse";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IImportCategory {
    name: string;
    description: string;
}

@injectable()
class ImportCategoryUseCase {
    constructor(
        @inject("SpecificationsRepository")
        private categoriesRepository: ICategoriesRepository) { }

    loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
        return new Promise((resolve, reject) => {
            // stream para ler os arquivos "em partes"
            const stream = fs.createReadStream(file.path);
            const categories: IImportCategory[] = [];

            const parseFile = csvParse();

            // pega o pedaço lido do arquivo e repassa para ser processado pelo csvParse
            stream.pipe(parseFile);

            // usar promise pois o parse é assíncrono
            parseFile.on("data", async (line) => {
                const [name, description] = line;
                categories.push({
                    name,
                    description,
                });
            })
                .on("end", () => {
                    // remover arquivo temporário
                    fs.promises.unlink(file.path);
                    resolve(categories);
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file);

        categories.map(async (category) => {
            const { name, description } = category;

            const existCategory = await this.categoriesRepository.findByName(name);

            if (!existCategory) {
                await this.categoriesRepository.create({
                    name,
                    description,
                });
            }
        })
    }
}

export { ImportCategoryUseCase };
