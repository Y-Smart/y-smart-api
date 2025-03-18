import { CommandsModule } from '@modules/commands/commands.module';
import { DevicesModule } from '@modules/devices/devices.module';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { HashService } from '@shared/services/hash.service';
import { AuthModule } from '@modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI as string, {
            dbName: 'ysmart',
        }),
        AuthModule,
        DevicesModule,
        CommandsModule,
    ],
    controllers: [],
    providers: [
        HashService,
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
