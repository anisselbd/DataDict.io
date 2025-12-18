"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FieldsService = class FieldsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id: dto.entityId,
                project: { userId },
            },
        });
        if (!entity) {
            throw new common_1.ForbiddenException('Entity not found or access denied');
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
    async findAll(userId, query) {
        const { page = 1, limit = 50, q, entityId, type, required, indexed } = query;
        const skip = (page - 1) * limit;
        const where = {
            entity: {
                project: { userId },
            },
        };
        if (entityId)
            where.entityId = entityId;
        if (type)
            where.type = { contains: type, mode: 'insensitive' };
        if (required !== undefined)
            where.required = required;
        if (indexed !== undefined)
            where.indexed = indexed;
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
    async reorder(userId, entityId, fieldIds) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id: entityId,
                project: { userId },
            },
        });
        if (!entity) {
            throw new common_1.ForbiddenException('Entity not found or access denied');
        }
        return this.prisma.$transaction(fieldIds.map((id, index) => this.prisma.field.update({
            where: { id },
            data: { order: index },
        })));
    }
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Field not found');
        }
        return field;
    }
    async update(id, userId, dto) {
        const field = await this.prisma.field.findFirst({
            where: {
                id,
                entity: {
                    project: { userId },
                },
            },
        });
        if (!field) {
            throw new common_1.NotFoundException('Field not found');
        }
        const { constraints, ...fieldData } = dto;
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
    async remove(id, userId) {
        const field = await this.prisma.field.findFirst({
            where: {
                id,
                entity: {
                    project: { userId },
                },
            },
        });
        if (!field) {
            throw new common_1.NotFoundException('Field not found');
        }
        await this.prisma.field.delete({ where: { id } });
        return { message: 'Field deleted successfully' };
    }
};
exports.FieldsService = FieldsService;
exports.FieldsService = FieldsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FieldsService);
//# sourceMappingURL=fields.service.js.map