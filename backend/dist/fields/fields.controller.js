"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsController = void 0;
const common_1 = require("@nestjs/common");
const fields_service_1 = require("./fields.service");
const field_dto_1 = require("./dto/field.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let FieldsController = class FieldsController {
    fieldsService;
    constructor(fieldsService) {
        this.fieldsService = fieldsService;
    }
    async create(user, dto) {
        return this.fieldsService.create(user.id, dto);
    }
    async findAll(user, query) {
        return this.fieldsService.findAll(user.id, query);
    }
    async reorder(user, entityId, body) {
        return this.fieldsService.reorder(user.id, entityId, body.fieldIds);
    }
    async findOne(user, id) {
        return this.fieldsService.findOne(id, user.id);
    }
    async update(user, id, dto) {
        return this.fieldsService.update(id, user.id, dto);
    }
    async remove(user, id) {
        return this.fieldsService.remove(id, user.id);
    }
};
exports.FieldsController = FieldsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, field_dto_1.CreateFieldDto]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, field_dto_1.FieldQueryDto]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('reorder'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('entityId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "reorder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, field_dto_1.UpdateFieldDto]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FieldsController.prototype, "remove", null);
exports.FieldsController = FieldsController = __decorate([
    (0, common_1.Controller)('fields'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [fields_service_1.FieldsService])
], FieldsController);
//# sourceMappingURL=fields.controller.js.map