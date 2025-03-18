import { CommandsService } from '@modules/commands/commands.service';
import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserRequest } from '@shared/types/UserRequest';
import { Command } from '@schemas/command.schema';

@Controller('commands')
export class CommandsController {
    constructor(private readonly _commandService: CommandsService) {}

    @Get()
    async findAllCommands(
        @Req() req: UserRequest,
        @Query('page') page?: number,
    ): Promise<Command[]> {
        return await this._commandService.findAllCommands(
            req.user.userId,
            page || 1,
        );
    }
}
