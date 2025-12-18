import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('projects')
export class ExportController {
    constructor(private exportService: ExportService) { }

    /**
     * GET /projects/:id/export/markdown
     * Export project documentation as Markdown
     */
    @Get(':id/export/markdown')
    @UseGuards(JwtAuthGuard)
    async exportMarkdown(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const markdown = await this.exportService.exportToMarkdown(id, user.id);

        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="data-dictionary-${id}.md"`,
        );
        res.send(markdown);
    }

    /**
     * GET /projects/:id/export/pdf
     * Export project documentation as PDF
     */
    @Get(':id/export/pdf')
    @UseGuards(JwtAuthGuard)
    async exportPdf(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const pdfBuffer = await this.exportService.exportToPdf(id, user.id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="data-dictionary-${id}.pdf"`,
        );
        res.send(pdfBuffer);
    }
}
