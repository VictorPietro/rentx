// DTO - Data Transfer Object, para receber valores das rotas
interface ICreateUserTokenDTO {
    user_id: string;
    expiration_date: Date;
    refresh_token: string;
}

export { ICreateUserTokenDTO };
