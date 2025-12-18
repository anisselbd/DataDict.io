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
import { EntitiesService } from './entities.service';
import { CreateEntityDto, UpdateEntityDto } from './dto/entity.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('entities')
@UseGuards(JwtAuthGuard)
export class EntitiesController {
    constructor(private entitiesService: EntitiesService) { }

    /**
     * POST /entities
     * Create a new entity
     */
    @Post()
    async create(
        @CurrentUser() user: { id: string },
        @Body() dto: CreateEntityDto,
    ) {
        return this.entitiesService.create(user.id, dto);
    }

    /**
     * GET /entities?projectId=xxx
     * List entities with optional project filter
     */
    @Get()
    async findAll(
        @CurrentUser() user: { id: string },
        @Query('projectId') projectId?: string,
        @Query() query?: PaginationDto,
    ) {
        return this.entitiesService.findAll(user.id, projectId, query);
    }

    /**
     * POST /entities/reorder
     * Reorder entities
     */
    @Post('reorder')
    async reorder(
        @CurrentUser() user: { id: string },
        @Query('projectId') projectId: string,
        @Body() body: { entityIds: string[] },
    ) {
        return this.entitiesService.reorder(user.id, projectId, body.entityIds);
    }

    /**
     * GET /entities/:id
     * Get a single entity with its fields
     */
    @Get(':id')
    async findOne(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.entitiesService.findOne(id, user.id);
    }

    /**
     * PATCH /entities/:id
     * Update an entity
     */
    @Patch(':id')
    async update(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
        @Body() dto: UpdateEntityDto,
    ) {
        return this.entitiesService.update(id, user.id, dto);
    }

    /**
     * DELETE /entities/:id
     * Delete an entity
     */
    @Delete(':id')
    async remove(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.entitiesService.remove(id, user.id);
    }
}
