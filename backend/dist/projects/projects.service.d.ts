import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateProjectDto): Promise<{
        _count: {
            entities: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        userId: string;
    }>;
    findAll(userId: string, query: PaginationDto): Promise<{
        data: ({
            _count: {
                entities: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        _count: {
            entities: number;
        };
        entities: ({
            _count: {
                fields: number;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            projectId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        userId: string;
    }>;
    findBySlug(slug: string): Promise<{
        entities: ({
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
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            projectId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        userId: string;
    }>;
    update(id: string, userId: string, dto: UpdateProjectDto): Promise<{
        _count: {
            entities: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    duplicate(id: string, userId: string): Promise<({
        _count: {
            entities: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        userId: string;
    }) | null>;
    private generateSlug;
}
