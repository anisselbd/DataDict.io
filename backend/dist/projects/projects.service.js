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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const slug = dto.slug || this.generateSlug(dto.name);
        const existingProject = await this.prisma.project.findUnique({
            where: { slug },
        });
        if (existingProject) {
            throw new common_1.ConflictException('A project with this slug already exists');
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
    async findAll(userId, query) {
        const { page = 1, limit = 20, q } = query;
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(q && {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Project not found');
        }
        return project;
    }
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException('Project not found');
        }
        return project;
    }
    async update(id, userId, dto) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (dto.slug && dto.slug !== project.slug) {
            const existing = await this.prisma.project.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('A project with this slug already exists');
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
    async remove(id, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await this.prisma.project.delete({ where: { id } });
        return { message: 'Project deleted successfully' };
    }
    async duplicate(id, userId) {
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
            throw new common_1.NotFoundException('Project not found');
        }
        const timestamp = Date.now().toString(36);
        const newSlug = `${project.slug}-copy-${timestamp}`;
        const newProject = await this.prisma.project.create({
            data: {
                name: `${project.name} (copie)`,
                slug: newSlug,
                description: project.description,
                userId,
            },
        });
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
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map