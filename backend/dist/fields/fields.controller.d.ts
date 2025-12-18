import { FieldsService } from './fields.service';
import { CreateFieldDto, UpdateFieldDto, FieldQueryDto } from './dto/field.dto';
export declare class FieldsController {
    private fieldsService;
    constructor(fieldsService: FieldsService);
    create(user: {
        id: string;
    }, dto: CreateFieldDto): Promise<{
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
    findAll(user: {
        id: string;
    }, query: FieldQueryDto): Promise<{
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
    reorder(user: {
        id: string;
    }, entityId: string, body: {
        fieldIds: string[];
    }): Promise<{
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
    findOne(user: {
        id: string;
    }, id: string): Promise<{
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
    update(user: {
        id: string;
    }, id: string, dto: UpdateFieldDto): Promise<{
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
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
