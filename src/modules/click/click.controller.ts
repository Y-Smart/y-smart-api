import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ClickService } from '@modules/click/click.service';
import { UserRequest } from '@shared/types/UserRequest';

@Controller('click/command')
export class ClickController {
    constructor(private readonly _clickService: ClickService) {}

    @Post(':deviceId')
    async clickDevice(
        @Req() req: UserRequest,
        @Param('deviceId') deviceId: string,
        @Body('state') state: string,
    ): Promise<void> {
        await this._clickService.clickDevice(req.user.userId, deviceId, state);
    }
}
