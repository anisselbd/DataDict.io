import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldDto, UpdateFieldDto, FieldQueryDto } from './dto/field.dto';
export declare class FieldsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateFieldDto): Promise<{
        constraints: {
            id: string;
            kind: import(".prisma/client").$Enums.ConstraintKind;
            value: string;
            fieldId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        defaultValue: string | null;
        entityId: string;
    }>;
    findAll(userId: string, query: FieldQueryDto): Promise<{
        data: ({
            entity: {
                name: string;
                id: string;
            };
            constraints: {
                id: string;
                kind: import(".prisma/client").$Enums.ConstraintKind;
                value: string;
                fieldId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    reorder(userId: string, entityId: string, fieldIds: string[]): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        defaultValue: string | null;
        entityId: string;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        entity: {
            project: {
                name: string;
                id: string;
            };
            name: string;
            id: string;
        };
        constraints: {
            id: string;
            kind: import(".prisma/client").$Enums.ConstraintKind;
            value: string;
            fieldId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        defaultValue: string | null;
        entityId: string;
    }>;
    update(id: string, userId: string, dto: UpdateFieldDto): Promise<{
        constraints: {
            id: string;
            kind: import(".prisma/client").$Enums.ConstraintKind;
            value: string;
            fieldId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        defaultValue: string | null;
        entityId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
