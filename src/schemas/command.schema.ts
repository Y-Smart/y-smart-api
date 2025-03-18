import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommandDocument = HydratedDocument<Command>;

@Schema()
export class Command {
    @Prop({ required: true, type: String, ref: 'User' })
    user: string;

    @Prop({ required: true })
    command: string;

    @Prop({
        required: true,
        enum: ['success', 'failed'],
        default: 'success',
    })
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
