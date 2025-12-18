import type { Response } from 'express';
import { ExportService } from './export.service';
export declare class ExportController {
    private exportService;
    constructor(exportService: ExportService);
    exportMarkdown(user: {
        id: string;
    }, id: string, res: Response): Promise<void>;
    exportPdf(user: {
        id: string;
    }, id: string, res: Response): Promise<void>;
}
