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
import { RelationsService } from './relations.service';
import { CreateRelationDto, UpdateRelationDto } from './dto/relation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('relations')
@UseGuards(JwtAuthGuard)
export class RelationsController {
    constructor(private relationsService: RelationsService) { }

    /**
     * POST /relations
     * Create a new relation
     */
    @Post()
    async create(@Body() dto: CreateRelationDto) {
        return this.relationsService.create(dto);
    }

    /**
     * GET /relations?projectId=xxx
     * Get all relations for a project
     */
    @Get()
    async findByProject(@Query('projectId') projectId: string) {
        return this.relationsService.findByProject(projectId);
    }

    /**
     * GET /relations/entity/:entityId
     * Get all relations for an entity
     */
    @Get('entity/:entityId')
    async findByEntity(@Param('entityId') entityId: string) {
        return this.relationsService.findByEntity(entityId);
    }

    /**
     * GET /relations/:id
     * Get a single relation
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.relationsService.findOne(id);
    }

    /**
     * PATCH /relations/:id
     * Update a relation
     */
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateRelationDto) {
        return this.relationsService.update(id, dto);
    }

    /**
     * DELETE /relations/:id
     * Delete a relation
     */
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.relationsService.remove(id);
    }
}
