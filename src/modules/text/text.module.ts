import { CommandsService } from '@modules/commands/commands.service';
import { TextController } from '@modules/text/text.controller';
import { Device, DeviceSchema } from '@schemas/device.schema';
import { TextService } from '@modules/text/text.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DevicesService } from '@modules/devices/devices.service';
import { MqttService } from '@modules/mqtt/mqtt.service';
import { Command, CommandSchema } from '@schemas/command.schema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            {
                name: Device.name,
                schema: DeviceSchema,
            },
            {
                name: Command.name,
                schema: CommandSchema,
            },
        ]),
    ],
    controllers: [TextController],
    providers: [TextService, CommandsService, DevicesService, MqttService],
})
export class TextModule {}
