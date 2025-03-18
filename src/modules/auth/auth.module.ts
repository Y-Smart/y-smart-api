import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { AuthController } from '@modules/auth/auth.controller';
import { HashService } from '@shared/services/hash.service';
import { AuthService } from '@modules/auth/auth.service';
import { User, UserSchema } from '@schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: false,
        }),
    ],
    controllers: [AuthController],
    providers: [HashService, AuthService, JwtStrategy],
})
export class AuthModule {}
