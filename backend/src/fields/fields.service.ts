import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldDto, UpdateFieldDto, FieldQueryDto } from './dto/field.dto';

@Injectable()
export class FieldsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new field
     */
    async create(userId: string, dto: CreateFieldDto) {
        // Verify entity ownership through project
        const entity = await this.prisma.entity.findFirst({
            where: {
                id: dto.entityId,
                project: { userId },
            },
        });

        if (!entity) {
            throw new ForbiddenException('Entity not found or access denied');
        }

        const { constraints, ...fieldData } = dto;

        return this.prisma.field.create({
            data: {
                ...fieldData,
                constraints: constraints
                    ? {
                        create: constraints,
                    }
                    : undefined,
            },
            include: { constraints: true },
        });
    }

    /**
     * Get all fields with filters
     */
    async findAll(userId: string, query: FieldQueryDto) {
        const { page = 1, limit = 50, q, entityId, type, required, indexed } = query;
        const skip = (page - 1) * limit;

        // Build where clause with ownership check
        const where: any = {
            entity: {
                project: { userId },
            },
        };

        if (entityId) where.entityId = entityId;
        if (type) where.type = { contains: type, mode: 'insensitive' };
        if (required !== undefined) where.required = required;
        if (indexed !== undefined) where.indexed = indexed;

        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { type: { contains: q, mode: 'insensitive' } },
            ];
        }

        const [fields, total] = await Promise.all([
            this.prisma.field.findMany({
                where,
                skip,
                take: limit,

                orderBy: [
                    { order: 'asc' },
                    { createdAt: 'asc' }
                ],
                include: {
                    constraints: true,
                    entity: { select: { id: true, name: true } },
                },
            }),
            this.prisma.field.count({ where }),
        ]);

        return {
            data: fields,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Reorder fields within an entity
     */
    async reorder(userId: string, entityId: string, fieldIds: string[]) {
        // Verify entity ownership
        const entity = await this.prisma.entity.findFirst({
            where: {
                id: entityId,
                project: { userId },
            },
        });

        if (!entity) {
            throw new ForbiddenException('Entity not found or access denied');
        }

        return this.prisma.$transaction(
            fieldIds.map((id, index) =>
                this.prisma.field.update({
                    where: { id },
                    data: { order: index },
                })
            )
        );
    }

    /**
     * Get a single field with constraints
     */
    async findOne(id: string, userId: string) {
        const field = await this.prisma.field.findFirst({
            where: {
                id,
                entity: {
                    project: { userId },
                },
            },
            include: {
                constraints: true,
                entity: {
                    select: { id: true, name: true, project: { select: { id: true, name: true } } },
                },
            },
        });

        if (!field) {
            throw new NotFoundException('Field not found');
        }

        return field;
    }

    /**
     * Update a field
     */
    async update(id: string, userId: string, dto: UpdateFieldDto) {
        const field = await this.prisma.field.findFirst({
            where: {
                id,
                entity: {
                    project: { userId },
                },
            },
        });

        if (!field) {
            throw new NotFoundException('Field not found');
        }

        const { constraints, ...fieldData } = dto;

        // If constraints are provided, delete existing and create new
        if (constraints) {
            await this.prisma.fieldConstraint.deleteMany({
                where: { fieldId: id },
            });
        }

        return this.prisma.field.update({
            where: { id },
            data: {
                ...fieldData,
                constraints: constraints
                    ? {
                        create: constraints,
                    }
                    : undefined,
            },
            include: { constraints: true },
        });
    }

    /**
     * Delete a field
     */
    async remove(id: string, userId: string) {
        const field = await this.prisma.field.findFirst({
            where: {
                id,
                entity: {
                    project: { userId },
                },
            },
        });

        if (!field) {
            throw new NotFoundException('Field not found');
        }

        await this.prisma.field.delete({ where: { id } });

        return { message: 'Field deleted successfully' };
    }
}
