import { Command } from '@schemas/command.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CommandsService {
    constructor(
        @InjectModel(Command.name)
        private readonly _commandModel: Model<Command>,
    ) {}
    async findAllCommands(userId: string, page: number): Promise<Command[]> {
        const skip = (page - 1) * 50;

        return await this._commandModel
            .find()
            .where('userId')
            .equals(userId)
            .limit(50)
            .skip(skip);
    }

    async createCommand(command: Command): Promise<void> {
        await this._commandModel.create(command);
    }
}
