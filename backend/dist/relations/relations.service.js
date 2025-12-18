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
exports.RelationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RelationsService = class RelationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const sourceField = await this.prisma.field.findUnique({
            where: { id: dto.sourceFieldId },
            include: { entity: true },
        });
        if (!sourceField) {
            throw new common_1.NotFoundException('Source field not found');
        }
        const targetEntity = await this.prisma.entity.findUnique({
            where: { id: dto.targetEntityId },
        });
        if (!targetEntity) {
            throw new common_1.NotFoundException('Target entity not found');
        }
        if (dto.targetFieldId) {
            const targetField = await this.prisma.field.findUnique({
                where: { id: dto.targetFieldId },
            });
            if (!targetField) {
                throw new common_1.NotFoundException('Target field not found');
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
    async findByProject(projectId) {
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
    async findByEntity(entityId) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Relation not found');
        }
        return relation;
    }
    async update(id, dto) {
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.relationship.delete({
            where: { id },
        });
        return { message: 'Relation deleted successfully' };
    }
};
exports.RelationsService = RelationsService;
exports.RelationsService = RelationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelationsService);
//# sourceMappingURL=relations.service.js.map