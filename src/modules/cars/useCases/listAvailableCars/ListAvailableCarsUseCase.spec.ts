import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();

        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory
        );
    });

    it("should be able to list all available cars", async () => {
        const car = {
            name: "Name",
            description: "Description",
            daily_rate: 122,
            license_plate: "ABC",
            fine_amount: 13,
            brand: "Brand",
            category_id: "1",
        };

        const carCreated = await carsRepositoryInMemory.create({
            name: car.name,
            description: car.description,
            daily_rate: car.daily_rate,
            license_plate: car.license_plate,
            fine_amount: car.fine_amount,
            brand: car.brand,
            category_id: car.category_id,
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([carCreated]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = {
            name: "Name",
            description: "Description",
            daily_rate: 122,
            license_plate: "ABC",
            fine_amount: 13,
            brand: "Brand",
            category_id: "1",
        };

        const carCreated = await carsRepositoryInMemory.create({
            name: car.name,
            description: car.description,
            daily_rate: car.daily_rate,
            license_plate: car.license_plate,
            fine_amount: car.fine_amount,
            brand: car.brand,
            category_id: car.category_id,
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: car.name
        });

        expect(cars).toEqual([carCreated]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = {
            name: "Name",
            description: "Description",
            daily_rate: 122,
            license_plate: "ABC",
            fine_amount: 13,
            brand: "Brand",
            category_id: "1",
        };

        const carCreated = await carsRepositoryInMemory.create({
            name: car.name,
            description: car.description,
            daily_rate: car.daily_rate,
            license_plate: car.license_plate,
            fine_amount: car.fine_amount,
            brand: car.brand,
            category_id: car.category_id,
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: car.brand
        });

        expect(cars).toEqual([carCreated]);
    });

    it("should be able to list all available cars by category", async () => {
        const car = {
            name: "Name",
            description: "Description",
            daily_rate: 122,
            license_plate: "ABC",
            fine_amount: 13,
            brand: "Brand",
            category_id: "1",
        };

        const carCreated = await carsRepositoryInMemory.create({
            name: car.name,
            description: car.description,
            daily_rate: car.daily_rate,
            license_plate: car.license_plate,
            fine_amount: car.fine_amount,
            brand: car.brand,
            category_id: car.category_id,
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: car.category_id
        });

        expect(cars).toEqual([carCreated]);
    });
});
