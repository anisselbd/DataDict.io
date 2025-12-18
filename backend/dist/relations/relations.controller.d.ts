import { RelationsService } from './relations.service';
import { CreateRelationDto, UpdateRelationDto } from './dto/relation.dto';
export declare class RelationsController {
    private relationsService;
    constructor(relationsService: RelationsService);
    create(dto: CreateRelationDto): Promise<{
        sourceField: {
            entity: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                projectId: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        };
        targetEntity: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            projectId: string;
        };
        targetField: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        } | null;
    } & {
        id: string;
        sourceFieldId: string;
        targetEntityId: string;
        targetFieldId: string | null;
    }>;
    findByProject(projectId: string): Promise<({
        sourceField: {
            entity: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                projectId: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        };
        targetEntity: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            projectId: string;
        };
        targetField: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        } | null;
    } & {
        id: string;
        sourceFieldId: string;
        targetEntityId: string;
        targetFieldId: string | null;
    })[]>;
    findByEntity(entityId: string): Promise<{
        outgoing: ({
            sourceField: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                type: string;
                required: boolean;
                unique: boolean;
                indexed: boolean;
                defaultValue: string | null;
                entityId: string;
            };
            targetEntity: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                projectId: string;
            };
            targetField: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                type: string;
                required: boolean;
                unique: boolean;
                indexed: boolean;
                defaultValue: string | null;
                entityId: string;
            } | null;
        } & {
            id: string;
            sourceFieldId: string;
            targetEntityId: string;
            targetFieldId: string | null;
        })[];
        incoming: ({
            sourceField: {
                entity: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    order: number;
                    projectId: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                type: string;
                required: boolean;
                unique: boolean;
                indexed: boolean;
                defaultValue: string | null;
                entityId: string;
            };
            targetEntity: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                projectId: string;
            };
            targetField: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                type: string;
                required: boolean;
                unique: boolean;
                indexed: boolean;
                defaultValue: string | null;
                entityId: string;
            } | null;
        } & {
            id: string;
            sourceFieldId: string;
            targetEntityId: string;
            targetFieldId: string | null;
        })[];
    }>;
    findOne(id: string): Promise<{
        sourceField: {
            entity: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                projectId: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        };
        targetEntity: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            projectId: string;
        };
        targetField: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        } | null;
    } & {
        id: string;
        sourceFieldId: string;
        targetEntityId: string;
        targetFieldId: string | null;
    }>;
    update(id: string, dto: UpdateRelationDto): Promise<{
        sourceField: {
            entity: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                projectId: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        };
        targetEntity: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            projectId: string;
        };
        targetField: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: string;
            required: boolean;
            unique: boolean;
            indexed: boolean;
            defaultValue: string | null;
            entityId: string;
        } | null;
    } & {
        id: string;
        sourceFieldId: string;
        targetEntityId: string;
        targetFieldId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
