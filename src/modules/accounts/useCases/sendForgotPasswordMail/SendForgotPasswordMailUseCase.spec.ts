import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        mailProvider = new MailProviderInMemory();

        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory, dateProvider, mailProvider);
    });

    it("should be able to send a forgot password mail to user", async () => {
        const sendMail = spyOn(mailProvider, "sendMail");

        const email = "ujtatiwe@leume.com";

        await usersRepositoryInMemory.create({
            driver_license: "558662",
            email,
            name: "Victor Hardy",
            password: "673112"
        });

        await sendForgotPasswordMailUseCase.execute(email);

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send a forgot password mail if user does not exist", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("ujtatiw2@leume.com")
        ).rejects.toEqual(new AppError("User does not exist!"));
    });

    it("should be able to create an users token", async () => {
        const generateTokenMail = spyOn(usersTokensRepositoryInMemory, "create");

        const email = "ujtatiwe@leume.com";

        await usersRepositoryInMemory.create({
            driver_license: "558662",
            email,
            name: "Victor Hardy",
            password: "673112"
        });

        await sendForgotPasswordMailUseCase.execute(email);

        expect(generateTokenMail).toHaveBeenCalled();
    });
});
