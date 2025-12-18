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
exports.EntitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EntitiesService = class EntitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const project = await this.prisma.project.findFirst({
            where: { id: dto.projectId, userId },
        });
        if (!project) {
            throw new common_1.ForbiddenException('Project not found or access denied');
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
    async findAll(userId, projectId, query) {
        const { page = 1, limit = 50, q } = query || {};
        const skip = (page - 1) * limit;
        const where = {
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
    async findOne(id, userId) {
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
                        { createdAt: 'asc' }
                    ],
                },
                _count: { select: { fields: true } },
            },
        });
        if (!entity) {
            throw new common_1.NotFoundException('Entity not found');
        }
        return entity;
    }
    async reorder(userId, projectId, entityIds) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, userId },
        });
        if (!project) {
            throw new common_1.ForbiddenException('Project not found or access denied');
        }
        return this.prisma.$transaction(entityIds.map((id, index) => this.prisma.entity.update({
            where: { id },
            data: { order: index },
        })));
    }
    async update(id, userId, dto) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id,
                project: { userId },
            },
        });
        if (!entity) {
            throw new common_1.NotFoundException('Entity not found');
        }
        return this.prisma.entity.update({
            where: { id },
            data: dto,
            include: {
                _count: { select: { fields: true } },
            },
        });
    }
    async remove(id, userId) {
        const entity = await this.prisma.entity.findFirst({
            where: {
                id,
                project: { userId },
            },
        });
        if (!entity) {
            throw new common_1.NotFoundException('Entity not found');
        }
        await this.prisma.entity.delete({ where: { id } });
        return { message: 'Entity deleted successfully' };
    }
};
exports.EntitiesService = EntitiesService;
exports.EntitiesService = EntitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntitiesService);
//# sourceMappingURL=entities.service.js.map