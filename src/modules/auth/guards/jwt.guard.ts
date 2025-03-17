/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseException } from '@shared/exceptions/base.exception';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {
    ExecutionContext,
    HttpStatus,
    Injectable,
    SetMetadata,
} from '@nestjs/common';

const _noAuthRequired = 'noAuthRequired';
export const NoAuthRequired = () => SetMetadata(_noAuthRequired, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isNoAuthRequired = this.reflector.get<boolean>(
            _noAuthRequired,
            context.getHandler(),
        );

        if (isNoAuthRequired) return true;

        return super.canActivate(context);
    }

    handleRequest<TUser = any>(
        err: any,
        user: TUser,
        info: any,
        context: ExecutionContext,
        status?: any,
    ): TUser {
        if (err || !user) {
            throw new BaseException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
