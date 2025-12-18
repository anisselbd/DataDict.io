import { EntitiesService } from './entities.service';
import { CreateEntityDto, UpdateEntityDto } from './dto/entity.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class EntitiesController {
    private entitiesService;
    constructor(entitiesService: EntitiesService);
    create(user: {
        id: string;
    }, dto: CreateEntityDto): Promise<{
        _count: {
            fields: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    findAll(user: {
        id: string;
    }, projectId?: string, query?: PaginationDto): Promise<{
        data: ({
            project: {
                id: string;
                name: string;
            };
            _count: {
                fields: number;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
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
    }, projectId: string, body: {
        entityIds: string[];
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }[]>;
    findOne(user: {
        id: string;
    }, id: string): Promise<{
        project: {
            id: string;
            name: string;
            slug: string;
        };
        fields: ({
            constraints: {
                id: string;
                kind: import(".prisma/client").$Enums.ConstraintKind;
                value: string;
                fieldId: string;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        })[];
        _count: {
            fields: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    update(user: {
        id: string;
    }, id: string, dto: UpdateEntityDto): Promise<{
        _count: {
            fields: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
