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
    findAll(user: {
        id: string;
    }, query: FieldQueryDto): Promise<{
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
    reorder(user: {
        id: string;
    }, entityId: string, body: {
        fieldIds: string[];
    }): Promise<{
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
    findOne(user: {
        id: string;
    }, id: string): Promise<{
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
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
