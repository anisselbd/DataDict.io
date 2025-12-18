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
        id: string;
        name: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    findAll(userId: string, projectId?: string, query?: PaginationDto): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    reorder(userId: string, projectId: string, entityIds: string[]): Promise<{
        id: string;
        name: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }[]>;
    update(id: string, userId: string, dto: UpdateEntityDto): Promise<{
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
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
