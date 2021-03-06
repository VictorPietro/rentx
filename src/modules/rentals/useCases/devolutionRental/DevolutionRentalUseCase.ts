import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { AppError } from "@shared/errors/AppError";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepositroy";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
    id: string;
    user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
    constructor(
        // sempre que houver esse inject ele lê qual repository quer, vai até o /shared/container, identifica o nome e pega o singleton desse repositório
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute({
        id,
        user_id,
    }: IRequest): Promise<Rental> {
        const rental = await this.rentalsRepository.findById(id);
        const car = await this.carsRepository.findById(rental.car_id);
        const minimum_rental_days = 1;

        if (!rental) {
            throw new AppError("Rental does not exist!");
        }

        const dateNow = this.dateProvider.dateNow()

        let rentalDays = this.dateProvider.compareInDays(rental.start_date, this.dateProvider.dateNow());

        if (rentalDays <= 0) {
            rentalDays = minimum_rental_days;
        }

        const delay = this.dateProvider.compareInDays(dateNow, rental.expected_return_date);

        let total = 0;

        if (delay > 0) {
            const calculate_fine = delay * car.fine_amount;
            total = calculate_fine;
        }

        total += rentalDays * car.daily_rate;

        rental.end_date = this.dateProvider.dateNow();
        rental.total = total;

        await this.rentalsRepository.create(rental);
        await this.carsRepository.updateAvailable(car.id, true);

        return rental;
    }
}

export { DevolutionRentalUseCase }
