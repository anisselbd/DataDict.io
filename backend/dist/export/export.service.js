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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PDFDocument = require('pdfkit');
let ExportService = class ExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProjectData(projectId, userId) {
        const where = { id: projectId };
        if (userId) {
            where.userId = userId;
        }
        const project = await this.prisma.project.findFirst({
            where,
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
    async exportToMarkdown(projectId, userId) {
        const project = await this.getProjectData(projectId, userId);
        let md = `# ${project.name}\n\n`;
        if (project.description) {
            md += `${project.description}\n\n`;
        }
        md += `---\n\n`;
        md += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;
        md += `## Table of Contents\n\n`;
        project.entities.forEach((entity, idx) => {
            md += `${idx + 1}. [${entity.name}](#${entity.name.toLowerCase().replace(/\s+/g, '-')})\n`;
        });
        md += `\n---\n\n`;
        for (const entity of project.entities) {
            md += `## ${entity.name}\n\n`;
            if (entity.description) {
                md += `${entity.description}\n\n`;
            }
            if (entity.fields.length === 0) {
                md += `*No fields defined*\n\n`;
                continue;
            }
            md += `| Field | Type | Required | Unique | Indexed | Default | Description |\n`;
            md += `|-------|------|----------|--------|---------|---------|-------------|\n`;
            for (const field of entity.fields) {
                const req = field.required ? '✓' : '';
                const uniq = field.unique ? '✓' : '';
                const idx = field.indexed ? '✓' : '';
                const def = field.defaultValue || '-';
                const desc = field.description || '-';
                md += `| \`${field.name}\` | \`${field.type}\` | ${req} | ${uniq} | ${idx} | ${def} | ${desc} |\n`;
            }
            md += `\n`;
            const fieldsWithConstraints = entity.fields.filter(f => f.constraints.length > 0);
            if (fieldsWithConstraints.length > 0) {
                md += `### Constraints\n\n`;
                for (const field of fieldsWithConstraints) {
                    md += `**${field.name}:**\n`;
                    for (const c of field.constraints) {
                        md += `- ${c.kind}: \`${c.value}\`\n`;
                    }
                    md += `\n`;
                }
            }
            md += `---\n\n`;
        }
        return md;
    }
    async exportToPdf(projectId, userId) {
        const project = await this.getProjectData(projectId, userId);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(24).font('Helvetica-Bold').text(project.name, { align: 'center' });
            doc.moveDown();
            if (project.description) {
                doc.fontSize(12).font('Helvetica').text(project.description, { align: 'center' });
                doc.moveDown();
            }
            doc.fontSize(10).fillColor('#666').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
            doc.moveDown(2);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown();
            for (const entity of project.entities) {
                if (doc.y > 700) {
                    doc.addPage();
                }
                doc.fontSize(16).font('Helvetica-Bold').fillColor('#000').text(entity.name);
                doc.moveDown(0.5);
                if (entity.description) {
                    doc.fontSize(10).font('Helvetica').fillColor('#444').text(entity.description);
                    doc.moveDown();
                }
                if (entity.fields.length === 0) {
                    doc.fontSize(10).font('Helvetica-Oblique').fillColor('#888').text('No fields defined');
                    doc.moveDown(2);
                    continue;
                }
                const tableTop = doc.y;
                const colWidths = [100, 70, 50, 50, 50, 80, 95];
                const headers = ['Field', 'Type', 'Req', 'Uniq', 'Idx', 'Default', 'Description'];
                doc.fontSize(9).font('Helvetica-Bold').fillColor('#333');
                let x = 50;
                headers.forEach((h, i) => {
                    doc.text(h, x, tableTop, { width: colWidths[i], align: 'left' });
                    x += colWidths[i];
                });
                doc.moveDown();
                doc.font('Helvetica').fontSize(8).fillColor('#000');
                for (const field of entity.fields) {
                    const y = doc.y;
                    if (y > 750) {
                        doc.addPage();
                    }
                    x = 50;
                    const row = [
                        field.name,
                        field.type,
                        field.required ? '✓' : '',
                        field.unique ? '✓' : '',
                        field.indexed ? '✓' : '',
                        field.defaultValue || '-',
                        (field.description || '-').substring(0, 30),
                    ];
                    row.forEach((cell, i) => {
                        doc.text(cell, x, doc.y, { width: colWidths[i], align: 'left', continued: i < row.length - 1 });
                        x += colWidths[i];
                    });
                    doc.moveDown(0.5);
                }
                doc.moveDown(2);
            }
            doc.end();
        });
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map