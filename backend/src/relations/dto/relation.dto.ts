import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRelationDto {
    @IsString()
    @IsNotEmpty()
    sourceFieldId: string;

    @IsString()
    @IsNotEmpty()
    targetEntityId: string;

    @IsString()
    @IsOptional()
    targetFieldId?: string;
}

export class UpdateRelationDto {
    @IsString()
    @IsOptional()
    targetEntityId?: string;

    @IsString()
    @IsOptional()
    targetFieldId?: string;
}
