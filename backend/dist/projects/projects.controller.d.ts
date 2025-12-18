import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    create(user: {
        id: string;
    }, dto: CreateProjectDto): Promise<{
        _count: {
            entities: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        userId: string;
    }>;
    findAll(user: {
        id: string;
    }, query: PaginationDto): Promise<{
        data: ({
            _count: {
                entities: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(user: {
        id: string;
    }, id: string): Promise<{
        _count: {
            entities: number;
        };
        entities: ({
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
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        userId: string;
    }>;
    update(user: {
        id: string;
    }, id: string, dto: UpdateProjectDto): Promise<{
        _count: {
            entities: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        userId: string;
    }>;
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
    duplicate(user: {
        id: string;
    }, id: string): Promise<({
        _count: {
            entities: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        userId: string;
    }) | null>;
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
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
        userId: string;
    }>;
}
