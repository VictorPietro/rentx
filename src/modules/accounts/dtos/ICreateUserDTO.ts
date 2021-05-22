// DTO - Data Transfer Object, para receber valores das rotas
interface ICreateUserDTO {
    name: string;
    password: string;
    email: string;
    driver_license: string;
    id?: string;
    avatar?: string;
}

export { ICreateUserDTO };
