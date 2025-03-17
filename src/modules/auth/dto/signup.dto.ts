import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
    @IsEmail(
        {},
        {
            message: "L'adresse email n'est pas valide",
        },
    )
    email: string;

    @IsNotEmpty({
        message: 'Le mot de passe doit contenir au moins 6 caractères',
    })
    @MinLength(6, {
        message: 'Le mot de passe doit contenir au moins 6 caractères',
    })
    password: string;
}
