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
        id: string;
        name: string;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        order: number;
        defaultValue: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        entityId: string;
    }>;
    findAll(userId: string, query: FieldQueryDto): Promise<{
        data: ({
            entity: {
                id: string;
                name: string;
            };
            constraints: {
                id: string;
                kind: import(".prisma/client").$Enums.ConstraintKind;
                value: string;
                fieldId: string;
            }[];
        } & {
            id: string;
            name: string;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            order: number;
            defaultValue: string | null;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        id: string;
        name: string;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        order: number;
        defaultValue: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        entityId: string;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        entity: {
            id: string;
            name: string;
            project: {
                id: string;
                name: string;
            };
        };
        constraints: {
            id: string;
            kind: import(".prisma/client").$Enums.ConstraintKind;
            value: string;
            fieldId: string;
        }[];
    } & {
        id: string;
        name: string;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        order: number;
        defaultValue: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        id: string;
        name: string;
        type: string;
        required: boolean;
        unique: boolean;
        indexed: boolean;
        order: number;
        defaultValue: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        entityId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
