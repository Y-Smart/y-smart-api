import { CommandsService } from '@modules/commands/commands.service';
import { TextController } from '@modules/text/text.controller';
import { Device, DeviceSchema } from '@schemas/device.schema';
import { TextService } from '@modules/text/text.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            {
                name: Device.name,
                schema: DeviceSchema,
            },
        ]),
    ],
    controllers: [TextController],
    providers: [TextService, CommandsService],
})
export class DevicesModule {}
