import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    location: string;
}
