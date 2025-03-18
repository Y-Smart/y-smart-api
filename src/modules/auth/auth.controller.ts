import { NoAuthRequired } from '@modules/auth/guards/jwt.guard';
import { AuthService } from '@modules/auth/auth.service';
import { SignupDto } from '@modules/auth/dto/signup.dto';
import { SigninDto } from '@modules/auth/dto/signin.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { SignInResponse } from './dto/external/signin.response';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('signin')
    @NoAuthRequired()
    async signin(@Body() signInDto: SigninDto): Promise<SignInResponse> {
        return await this._authService.signIn(signInDto);
    }

    @Post('signup')
    @NoAuthRequired()
    async signup(@Body() signUpDto: SignupDto): Promise<SignInResponse> {
        return await this._authService.signUp(signUpDto);
    }
}
