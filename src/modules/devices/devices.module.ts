import { DevicesController } from '@modules/devices/devices.controller';
import { DevicesService } from '@modules/devices/devices.service';
import { Device, DeviceSchema } from '@schemas/device.schema';
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
    controllers: [DevicesController],
    providers: [DevicesService, MqttService],
})
export class DevicesModule {}
