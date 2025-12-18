import { PrismaService } from '../prisma/prisma.service';
import { CreateEntityDto, UpdateEntityDto } from './dto/entity.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class EntitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateEntityDto): Promise<{
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
    findAll(userId: string, projectId?: string, query?: PaginationDto): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    reorder(userId: string, projectId: string, entityIds: string[]): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        projectId: string;
    }[]>;
    update(id: string, userId: string, dto: UpdateEntityDto): Promise<{
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
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
