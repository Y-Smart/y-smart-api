import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
    @IsEmail(
        {},
        {
            message: "l'email ou le mot de passe est incorrect",
        },
    )
    email: string;

    @IsNotEmpty({
        message: "l'email ou le mot de passe est incorrect",
    })
    password: string;
}
