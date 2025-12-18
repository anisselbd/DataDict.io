import { IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateEntityDto {
    @IsUUID()
    projectId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}

export class UpdateEntityDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}
