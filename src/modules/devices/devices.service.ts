import { Device } from '@schemas/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class DevicesService {
    constructor(
        @InjectModel(Device.name) private readonly _deviceModel: Model<Device>,
    ) {}

    async findAllDevices(userId: string): Promise<Device[]> {
        return await this._deviceModel.find({}).where('owner').equals(userId);
    }

    async findDeviceByLocation(userId: string, type: string, location: string) {
        const result = await this._deviceModel
            .findOne({ type, location })
            .where('owner')
            .equals(userId);

        return result;
    }

    async findDeviceById(
        userId: string,
        deviceId: string,
    ): Promise<Device | null> {
        return await this._deviceModel
            .findById(deviceId)
            .where('owner')
            .equals(userId);
    }

    async createDevice(device: Partial<Device>): Promise<void> {
        await this._deviceModel.create({
            ...device,
        });
    }

    async updateDevice(
        userId: string,
        deviceId: string,
        device: Partial<Device>,
    ): Promise<void> {
        await this._deviceModel
            .findByIdAndUpdate(deviceId, {
                ...device,
            })
            .where('owner')
            .equals(userId);
    }

    async deleteDevice(userId: string, deviceId: string): Promise<void> {
        await this._deviceModel
            .findByIdAndDelete(deviceId)
            .where('owner')
            .equals(userId);
    }
}
