import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class ExportService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get project data for export
     */
    private async getProjectData(projectId: string, userId?: string) {
        const where: any = { id: projectId };
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
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    /**
     * Export project to Markdown format
     */
    async exportToMarkdown(projectId: string, userId?: string): Promise<string> {
        const project = await this.getProjectData(projectId, userId);

        let md = `# ${project.name}\n\n`;

        if (project.description) {
            md += `${project.description}\n\n`;
        }

        md += `---\n\n`;
        md += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;
        md += `## Table of Contents\n\n`;

        // TOC
        project.entities.forEach((entity, idx) => {
            md += `${idx + 1}. [${entity.name}](#${entity.name.toLowerCase().replace(/\s+/g, '-')})\n`;
        });

        md += `\n---\n\n`;

        // Entities
        for (const entity of project.entities) {
            md += `## ${entity.name}\n\n`;

            if (entity.description) {
                md += `${entity.description}\n\n`;
            }

            if (entity.fields.length === 0) {
                md += `*No fields defined*\n\n`;
                continue;
            }

            // Fields table
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

            // Constraints section
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

    /**
     * Export project to PDF format
     */
    async exportToPdf(projectId: string, userId?: string): Promise<Buffer> {
        const project = await this.getProjectData(projectId, userId);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Title
            doc.fontSize(24).font('Helvetica-Bold').text(project.name, { align: 'center' });
            doc.moveDown();

            if (project.description) {
                doc.fontSize(12).font('Helvetica').text(project.description, { align: 'center' });
                doc.moveDown();
            }

            doc.fontSize(10).fillColor('#666').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
            doc.moveDown(2);

            // Separator
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
            doc.moveDown();

            // Entities
            for (const entity of project.entities) {
                // Check if we need a new page
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

                // Fields table header
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

                // Fields rows
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
}
