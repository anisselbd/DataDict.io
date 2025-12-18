import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new project
     */
    async create(userId: string, dto: CreateProjectDto) {
        // Generate slug if not provided
        const slug = dto.slug || this.generateSlug(dto.name);

        // Check if slug is unique
        const existingProject = await this.prisma.project.findUnique({
            where: { slug },
        });

        if (existingProject) {
            throw new ConflictException('A project with this slug already exists');
        }

        return this.prisma.project.create({
            data: {
                name: dto.name,
                description: dto.description,
                slug,
                userId,
            },
            include: {
                _count: { select: { entities: true } },
            },
        });
    }

    /**
     * Get all projects for a user with pagination and search
     */
    async findAll(userId: string, query: PaginationDto) {
        const { page = 1, limit = 20, q } = query;
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(q && {
                OR: [
                    { name: { contains: q, mode: 'insensitive' as const } },
                    { description: { contains: q, mode: 'insensitive' as const } },
                ],
            }),
        };

        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    _count: { select: { entities: true } },
                },
            }),
            this.prisma.project.count({ where }),
        ]);

        return {
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single project by ID
     */
    async findOne(id: string, userId: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
            include: {
                entities: {
                    include: {
                        _count: { select: { fields: true } },
                    },
                    orderBy: { name: 'asc' },
                },
                _count: { select: { entities: true } },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    /**
     * Get a project by slug (public access)
     */
    async findBySlug(slug: string) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
            include: {
                entities: {
                    include: {
                        fields: {
                            include: { constraints: true },
                            orderBy: { name: 'asc' },
                        },
                    },
                    orderBy: { name: 'asc' },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    /**
     * Update a project
     */
    async update(id: string, userId: string, dto: UpdateProjectDto) {
        // Check ownership
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Check slug uniqueness if changing
        if (dto.slug && dto.slug !== project.slug) {
            const existing = await this.prisma.project.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new ConflictException('A project with this slug already exists');
            }
        }

        return this.prisma.project.update({
            where: { id },
            data: dto,
            include: {
                _count: { select: { entities: true } },
            },
        });
    }

    /**
     * Delete a project
     */
    async remove(id: string, userId: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        await this.prisma.project.delete({ where: { id } });

        return { message: 'Project deleted successfully' };
    }
    /**
     * Duplicate a project with all its entities and fields
     */
    async duplicate(id: string, userId: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
            include: {
                entities: {
                    include: {
                        fields: {
                            include: { constraints: true },
                        },
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Generate unique slug
        const timestamp = Date.now().toString(36);
        const newSlug = `${project.slug}-copy-${timestamp}`;

        // Create new project
        const newProject = await this.prisma.project.create({
            data: {
                name: `${project.name} (copie)`,
                slug: newSlug,
                description: project.description,
                userId,
            },
        });

        // Duplicate entities and fields
        for (const entity of project.entities) {
            const newEntity = await this.prisma.entity.create({
                data: {
                    name: entity.name,
                    description: entity.description,
                    projectId: newProject.id,
                },
            });

            for (const field of entity.fields) {
                await this.prisma.field.create({
                    data: {
                        name: field.name,
                        type: field.type,
                        description: field.description,
                        defaultValue: field.defaultValue,
                        required: field.required,
                        unique: field.unique,
                        indexed: field.indexed,
                        entityId: newEntity.id,
                    },
                });
            }
        }

        return this.prisma.project.findUnique({
            where: { id: newProject.id },
            include: {
                _count: { select: { entities: true } },
            },
        });
    }

    /**
     * Generate a URL-friendly slug from a name
     */
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    }
}
