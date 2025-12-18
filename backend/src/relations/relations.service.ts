import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRelationDto, UpdateRelationDto } from './dto/relation.dto';

@Injectable()
export class RelationsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new relation
     */
    async create(dto: CreateRelationDto) {
        // Verify source field exists
        const sourceField = await this.prisma.field.findUnique({
            where: { id: dto.sourceFieldId },
            include: { entity: true },
        });

        if (!sourceField) {
            throw new NotFoundException('Source field not found');
        }

        // Verify target entity exists
        const targetEntity = await this.prisma.entity.findUnique({
            where: { id: dto.targetEntityId },
        });

        if (!targetEntity) {
            throw new NotFoundException('Target entity not found');
        }

        // Verify target field exists if provided
        if (dto.targetFieldId) {
            const targetField = await this.prisma.field.findUnique({
                where: { id: dto.targetFieldId },
            });

            if (!targetField) {
                throw new NotFoundException('Target field not found');
            }
        }

        return this.prisma.relationship.create({
            data: {
                sourceFieldId: dto.sourceFieldId,
                targetEntityId: dto.targetEntityId,
                targetFieldId: dto.targetFieldId || null,
            },
            include: {
                sourceField: {
                    include: { entity: true },
                },
                targetEntity: true,
                targetField: true,
            },
        });
    }

    /**
     * Find all relations for a project
     */
    async findByProject(projectId: string) {
        return this.prisma.relationship.findMany({
            where: {
                sourceField: {
                    entity: {
                        projectId,
                    },
                },
            },
            include: {
                sourceField: {
                    include: { entity: true },
                },
                targetEntity: true,
                targetField: true,
            },
        });
    }

    /**
     * Find all relations for an entity (both incoming and outgoing)
     */
    async findByEntity(entityId: string) {
        const outgoing = await this.prisma.relationship.findMany({
            where: {
                sourceField: {
                    entityId,
                },
            },
            include: {
                sourceField: true,
                targetEntity: true,
                targetField: true,
            },
        });

        const incoming = await this.prisma.relationship.findMany({
            where: {
                targetEntityId: entityId,
            },
            include: {
                sourceField: {
                    include: { entity: true },
                },
                targetEntity: true,
                targetField: true,
            },
        });

        return { outgoing, incoming };
    }

    /**
     * Find one relation by ID
     */
    async findOne(id: string) {
        const relation = await this.prisma.relationship.findUnique({
            where: { id },
            include: {
                sourceField: {
                    include: { entity: true },
                },
                targetEntity: true,
                targetField: true,
            },
        });

        if (!relation) {
            throw new NotFoundException('Relation not found');
        }

        return relation;
    }

    /**
     * Update a relation
     */
    async update(id: string, dto: UpdateRelationDto) {
        await this.findOne(id);

        return this.prisma.relationship.update({
            where: { id },
            data: dto,
            include: {
                sourceField: {
                    include: { entity: true },
                },
                targetEntity: true,
                targetField: true,
            },
        });
    }

    /**
     * Delete a relation
     */
    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.relationship.delete({
            where: { id },
        });

        return { message: 'Relation deleted successfully' };
    }
}
