import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntityDto, UpdateEntityDto } from './dto/entity.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class EntitiesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new entity
     */
    async create(userId: string, dto: CreateEntityDto) {
        // Verify project ownership
        const project = await this.prisma.project.findFirst({
            where: { id: dto.projectId, userId },
        });

        if (!project) {
            throw new ForbiddenException('Project not found or access denied');
        }

        return this.prisma.entity.create({
            data: {
                name: dto.name,
                description: dto.description,
                projectId: dto.projectId,
            },
            include: {
                _count: { select: { fields: true } },
            },
        });
    }

    /**
     * Get all entities with optional projectId filter
     */
    async findAll(userId: string, projectId?: string, query?: PaginationDto) {
        const { page = 1, limit = 50, q } = query || {};
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            project: { userId },
        };

        if (projectId) {
            where.projectId = projectId;
        }

        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }

        const [entities, total] = await Promise.all([
            this.prisma.entity.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { order: 'asc' },
                    { createdAt: 'asc' }
                ],
                include: {
                    _count: { select: { fields: true } },
                    project: { select: { id: true, name: true } },
                },
            }),
            this.prisma.entity.count({ where }),
        ]);

        return {
            data: entities,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single entity with its fields
     */
    async findOne(id: string, userId: string) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id,
                project: { userId },
            },
            include: {
                project: { select: { id: true, name: true, slug: true } },
                fields: {
                    include: { constraints: true },
                    orderBy: [
                        { order: 'asc' },
                        { createdAt: 'asc' } // fallback
                    ],
                },
                _count: { select: { fields: true } },
            },
        });

        if (!entity) {
            throw new NotFoundException('Entity not found');
        }

        return entity;
    }

    /**
     * Reorder entities
     */
    async reorder(userId: string, projectId: string, entityIds: string[]) {
        // Verify project ownership
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            throw new ForbiddenException('Project not found or access denied');
        }

        return this.prisma.$transaction(
            entityIds.map((id, index) =>
                this.prisma.entity.update({
                    where: { id },
                    data: { order: index },
                })
            )
        );
    }

    /**
     * Update an entity
     */
    async update(id: string, userId: string, dto: UpdateEntityDto) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id,
                project: { userId },
            },
        });

        if (!entity) {
            throw new NotFoundException('Entity not found');
        }

        return this.prisma.entity.update({
            where: { id },
            data: dto,
            include: {
                _count: { select: { fields: true } },
            },
        });
    }

    /**
     * Delete an entity
     */
    async remove(id: string, userId: string) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id,
                project: { userId },
            },
        });

        if (!entity) {
            throw new NotFoundException('Entity not found');
        }

        await this.prisma.entity.delete({ where: { id } });

        return { message: 'Entity deleted successfully' };
    }
}
