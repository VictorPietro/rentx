import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

import { AppError } from "@shared/errors/AppError";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(
            carsRepositoryInMemory
        );
    });

    it("should be able to create a new car", async () => {
        const car = {
            name: "Name",
            description: "Description",
            daily_rate: 122,
            license_plate: "ABC",
            fine_amount: 13,
            brand: "Brand",
            category_id: "1",
        };

        const carCreated = await createCarUseCase.execute({
            name: car.name,
            description: car.description,
            daily_rate: car.daily_rate,
            license_plate: car.license_plate,
            fine_amount: car.fine_amount,
            brand: car.brand,
            category_id: car.category_id,
        });

        expect(carCreated).toHaveProperty("id");
    });

    it("should not be able to create a new car with existing license plate", async () => {
        expect(async () => {
            const car = {
                name: "Name",
                description: "Description",
                daily_rate: 122,
                license_plate: "ABC",
                fine_amount: 13,
                brand: "Brand",
                category_id: "1",
            };


            const car_2 = {
                name: "Name 2",
                description: "Description 2",
                daily_rate: 122,
                license_plate: "ABC",
                fine_amount: 13,
                brand: "Brand",
                category_id: "1",
            };

            await createCarUseCase.execute({
                name: car.name,
                description: car.description,
                daily_rate: car.daily_rate,
                license_plate: car.license_plate,
                fine_amount: car.fine_amount,
                brand: car.brand,
                category_id: car.category_id,
            });

            await createCarUseCase.execute({
                name: car_2.name,
                description: car_2.description,
                daily_rate: car_2.daily_rate,
                license_plate: car_2.license_plate,
                fine_amount: car_2.fine_amount,
                brand: car_2.brand,
                category_id: car_2.category_id,
            });
        }).rejects.toBeInstanceOf(AppError);
    });


    it("should be able to create a car with available true by default", async () => {
        const car = {
            name: "Name",
            description: "Description",
            daily_rate: 122,
            license_plate: "ABC",
            fine_amount: 13,
            brand: "Brand",
            category_id: "1",
        };

        const carCreated = await createCarUseCase.execute({
            name: car.name,
            description: car.description,
            daily_rate: car.daily_rate,
            license_plate: car.license_plate,
            fine_amount: car.fine_amount,
            brand: car.brand,
            category_id: car.category_id,
        });

        expect(carCreated.available).toBe(true);
    });
});
