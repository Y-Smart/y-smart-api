import { Injectable } from '@nestjs/common';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';

@Injectable()
export class MqttService {
    private _client: ClientProxy;

    constructor() {
        this._client = ClientProxyFactory.create({
            transport: Transport.MQTT,
            options: {
                url: 'mqtt://localhost:1883',
            },
        });
    }

    publish(userId: string, topic: string, state: string): void {
        this._client.emit(`devices/${userId}/${topic}`, state);
    }
}
