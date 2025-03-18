import { CreateDeviceDto } from '@modules/devices/dto/createDeviceDto';
import { DevicesService } from '@modules/devices/devices.service';
import { MqttService } from '@modules/mqtt/mqtt.service';
import { UserRequest } from '@shared/types/UserRequest';
import { Device } from '@schemas/device.schema';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';

@Controller('devices')
export class DevicesController {
    constructor(
        private readonly _deviceService: DevicesService,
        private readonly _mqttService: MqttService,
    ) {}

    @Get(':deviceId')
    async findDeviceById(
        @Req() req: UserRequest,
        @Param('deviceId') deviceId: string,
    ): Promise<Device | null> {
        return await this._deviceService.findDeviceById(
            req.user.userId,
            deviceId,
        );
    }

    @Get()
    async findAllDevices(@Req() req: UserRequest): Promise<Device[]> {
        return await this._deviceService.findAllDevices(req.user.userId);
    }

    @Post()
    async createDevice(
        @Req() req: UserRequest,
        @Body() deviceDto: CreateDeviceDto,
    ): Promise<void> {
        await this._deviceService.createDevice({
            location: deviceDto.location.toLowerCase(),
            type: deviceDto.type.toLowerCase(),
            state: 'off',
            owner: req.user.userId,
            createdAt: new Date(),
        });
    }

    @Patch(':deviceId')
    async updateDevice(
        @Req() req: UserRequest,
        @Param('deviceId') deviceId: string,
        @Body() deviceDto: CreateDeviceDto,
    ): Promise<void> {
        await this._deviceService.updateDevice(req.user.userId, deviceId, {
            type: deviceDto.type.toLowerCase(),
            location: deviceDto.location.toLowerCase(),
        });
    }

    @Patch(':deviceId/state')
    async updateDeviceState(
        @Req() req: UserRequest,
        @Param('deviceId') deviceId: string,
        @Body('state') state: string,
    ): Promise<void> {
        await this._deviceService.updateDevice(req.user.userId, deviceId, {
            state,
        });

        this._mqttService.publish(req.user.userId, deviceId, state);
    }

    @Delete(':deviceId')
    async deleteDevice(
        @Req() req: UserRequest,
        @Param('deviceId') deviceId: string,
    ): Promise<void> {
        await this._deviceService.deleteDevice(req.user.userId, deviceId);
    }
}
