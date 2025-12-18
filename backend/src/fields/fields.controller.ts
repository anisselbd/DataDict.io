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
import { FieldsService } from './fields.service';
import { CreateFieldDto, UpdateFieldDto, FieldQueryDto } from './dto/field.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('fields')
@UseGuards(JwtAuthGuard)
export class FieldsController {
    constructor(private fieldsService: FieldsService) { }

    /**
     * POST /fields
     * Create a new field
     */
    @Post()
    async create(
        @CurrentUser() user: { id: string },
        @Body() dto: CreateFieldDto,
    ) {
        return this.fieldsService.create(user.id, dto);
    }

    /**
     * GET /fields?entityId=xxx&type=xxx&required=true
     * List fields with filters
     */
    @Get()
    async findAll(
        @CurrentUser() user: { id: string },
        @Query() query: FieldQueryDto,
    ) {
        return this.fieldsService.findAll(user.id, query);
    }

    /**
     * POST /fields/reorder
     * Reorder fields
     */
    @Post('reorder')
    async reorder(
        @CurrentUser() user: { id: string },
        @Query('entityId') entityId: string,
        @Body() body: { fieldIds: string[] },
    ) {
        return this.fieldsService.reorder(user.id, entityId, body.fieldIds);
    }

    /**
     * GET /fields/:id
     * Get a single field with constraints
     */
    @Get(':id')
    async findOne(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.fieldsService.findOne(id, user.id);
    }

    /**
     * PATCH /fields/:id
     * Update a field
     */
    @Patch(':id')
    async update(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
        @Body() dto: UpdateFieldDto,
    ) {
        return this.fieldsService.update(id, user.id, dto);
    }

    /**
     * DELETE /fields/:id
     * Delete a field
     */
    @Delete(':id')
    async remove(
        @CurrentUser() user: { id: string },
        @Param('id') id: string,
    ) {
        return this.fieldsService.remove(id, user.id);
    }
}
