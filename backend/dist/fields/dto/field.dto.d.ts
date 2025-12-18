declare enum ConstraintKind {
    ENUM = "ENUM",
    REGEX = "REGEX",
    MIN = "MIN",
    MAX = "MAX",
    MINLENGTH = "MINLENGTH",
    MAXLENGTH = "MAXLENGTH"
}
declare class CreateConstraintDto {
    kind: ConstraintKind;
    value: string;
}
export declare class CreateFieldDto {
    entityId: string;
    name: string;
    type: string;
    required?: boolean;
    unique?: boolean;
    indexed?: boolean;
    defaultValue?: string;
    description?: string;
    constraints?: CreateConstraintDto[];
}
export declare class UpdateFieldDto {
    name?: string;
    type?: string;
    required?: boolean;
    unique?: boolean;
    indexed?: boolean;
    defaultValue?: string;
    description?: string;
    constraints?: CreateConstraintDto[];
}
export declare class FieldQueryDto {
    entityId?: string;
    type?: string;
    required?: boolean;
    indexed?: boolean;
    q?: string;
    page?: number;
    limit?: number;
}
export {};
