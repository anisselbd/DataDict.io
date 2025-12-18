import { PrismaService } from '../prisma/prisma.service';
export declare class ExportService {
    private prisma;
    constructor(prisma: PrismaService);
    private getProjectData;
    exportToMarkdown(projectId: string, userId?: string): Promise<string>;
    exportToPdf(projectId: string, userId?: string): Promise<Buffer>;
}
