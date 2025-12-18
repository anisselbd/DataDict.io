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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        projectId: string;
    }>;
    findAll(user: {
        id: string;
    }, projectId?: string, query?: PaginationDto): Promise<{
        data: ({
            project: {
                name: string;
                id: string;
            };
            _count: {
                fields: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        projectId: string;
    }[]>;
    findOne(user: {
        id: string;
    }, id: string): Promise<{
        project: {
            name: string;
            id: string;
            slug: string;
        };
        _count: {
            fields: number;
        };
        fields: ({
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
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        projectId: string;
    }>;
    update(user: {
        id: string;
    }, id: string, dto: UpdateEntityDto): Promise<{
        _count: {
            fields: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        projectId: string;
    }>;
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
