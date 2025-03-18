import { ClickController } from '@modules/click/click.controller';
import { Device, DeviceSchema } from '@schemas/device.schema';
import { ClickService } from '@modules/click/click.service';
import { MqttService } from '@modules/mqtt/mqtt.service';
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
    controllers: [ClickController],
    providers: [ClickService, MqttService],
})
export class ClickModule {}
