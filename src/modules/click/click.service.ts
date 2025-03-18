import { MqttService } from '@modules/mqtt/mqtt.service';
import { Device } from '@schemas/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ClickService {
    constructor(
        @InjectModel(Device.name)
        private readonly _deviceModel: Model<Device>,
        private readonly _mqttService: MqttService,
    ) {}

    async clickDevice(
        userId: string,
        deviceId: string,
        state: string,
    ): Promise<void> {
        await this._deviceModel
            .findByIdAndUpdate(deviceId, {
                state,
            })
            .where('userId')
            .equals(userId);

        this._mqttService.publish(userId, deviceId, state);
    }
}
