import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    /**
     * POST /projects
     * Create a new project
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @CurrentUser() user: { id: string },
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.create(user.id, dto);
    }

    /**
     * GET /projects
     * List all projects for the current user
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @CurrentUser() user: { id: string },
        @Query() query: PaginationDto,
    ) {
        return this.projectsService.findAll(user.id, query);
    }

    /**
     * GET /projects/:id
     * Get a single project by ID
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.projectsService.findOne(id, user.id);
    }

    /**
     * PATCH /projects/:id
     * Update a project
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.update(id, user.id, dto);
    }

    /**
     * DELETE /projects/:id
     * Delete a project
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.projectsService.remove(id, user.id);
    }
    /**
     * POST /projects/:id/duplicate
     * Duplicate a project with all entities and fields
     */
    @Post(':id/duplicate')
    @UseGuards(JwtAuthGuard)
    async duplicate(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.projectsService.duplicate(id, user.id);
    }

    /**
     * GET /projects/public/:slug
     * Get a project by slug (public, no auth required)
     */
    @Get('public/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.projectsService.findBySlug(slug);
    }
}
