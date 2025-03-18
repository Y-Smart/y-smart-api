import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
    @Prop({ type: String, ref: 'User', required: true })
    owner: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    state: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
