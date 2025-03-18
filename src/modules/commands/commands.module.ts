import { CommandsController } from '@modules/commands/commands.controller';
import { CommandsService } from '@modules/commands/commands.service';
import { Command, CommandSchema } from '@schemas/command.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            {
                name: Command.name,
                schema: CommandSchema,
            },
        ]),
    ],
    controllers: [CommandsController],
    providers: [CommandsService],
})
export class CommandsModule {}
