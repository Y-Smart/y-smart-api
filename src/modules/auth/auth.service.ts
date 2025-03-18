import { SignInResponse } from '@modules/auth/dto/external/signin.response';
import { BaseException } from '@shared/exceptions/base.exception';
import { HashService } from '@shared/services/hash.service';
import { SigninDto } from '@modules/auth/dto/signin.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from './dto/signup.dto';
import { User } from '@schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly _userModel: Model<User>,
        private readonly _hashService: HashService,
        private readonly _jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignupDto): Promise<SignInResponse> {
        const userExists = await this._userModel.findOne({
            email: signUpDto.email,
        });

        if (userExists) {
            throw new BaseException(
                'Ce compte existe déjà',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await this._hashService.hashAsync(
            signUpDto.password,
        );

        const user = await this._userModel.create({
            ...signUpDto,
            password: hashedPassword,
        });

        const token = await this._jwtService.signAsync({
            sub: user._id.toString(),
        });

        return {
            accessToken: token,
        };
    }

    async signIn(signInDto: SigninDto): Promise<SignInResponse> {
        const user = await this._userModel.findOne({
            email: signInDto.email,
        });

        if (!user) {
            throw new BaseException(
                "l'email ou le mot de passe est incorrect",
                HttpStatus.UNAUTHORIZED,
            );
        }

        const isValidPassword = await this._hashService.compareAsync(
            signInDto.password,
            user?.password.toString(),
        );

        if (!isValidPassword) {
            throw new BaseException(
                "l'email ou le mot de passe est incorrect",
                HttpStatus.UNAUTHORIZED,
            );
        }

        const token = await this._jwtService.signAsync({
            sub: user._id.toString(),
        });

        return {
            accessToken: token,
        };
    }
}
