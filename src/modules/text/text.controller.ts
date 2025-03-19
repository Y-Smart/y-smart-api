import { Body, Controller, Post, Req } from '@nestjs/common';
import { TextService } from '@modules/text/text.service';
import { UserRequest } from '@shared/types/UserRequest';

@Controller('text/command')
export class TextController {
    constructor(private readonly _textService: TextService) {}

    @Post()
    async createCommand(
        @Req() req: UserRequest,
        @Body('command') command: string,
    ): Promise<string> {
        return await this._textService.createCommand(req.user.userId, command);
    }
}
