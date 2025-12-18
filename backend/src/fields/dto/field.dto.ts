import {
    IsString,
    IsOptional,
    IsUUID,
    IsBoolean,
    MinLength,
    MaxLength,
    IsArray,
    ValidateNested,
    IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Constraint kind enum matching Prisma
enum ConstraintKind {
    ENUM = 'ENUM',
    REGEX = 'REGEX',
    MIN = 'MIN',
    MAX = 'MAX',
    MINLENGTH = 'MINLENGTH',
    MAXLENGTH = 'MAXLENGTH',
}

class CreateConstraintDto {
    @IsEnum(ConstraintKind)
    kind: ConstraintKind;

    @IsString()
    value: string;
}

export class CreateFieldDto {
    @IsUUID()
    entityId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    type: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    required?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    unique?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    indexed?: boolean;

    @IsOptional()
    @IsString()
    defaultValue?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateConstraintDto)
    constraints?: CreateConstraintDto[];
}

export class UpdateFieldDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    type?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    required?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    unique?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    indexed?: boolean;

    @IsOptional()
    @IsString()
    defaultValue?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateConstraintDto)
    constraints?: CreateConstraintDto[];
}

export class FieldQueryDto {
    @IsOptional()
    @IsUUID()
    entityId?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    required?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    indexed?: boolean;

    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    limit?: number = 50;
}
