import { IsOptional, IsString } from 'class-validator';

export class SignInResponse {
    @IsString()
    @IsOptional()
    accessToken?: string | null;
}
