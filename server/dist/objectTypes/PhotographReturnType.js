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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotographReturnType = void 0;
const type_graphql_1 = require("type-graphql");
const Photograph_1 = require("../entities/Photograph");
const PhotographError_1 = require("./PhotographError");
let PhotographReturnType = class PhotographReturnType {
};
__decorate([
    (0, type_graphql_1.Field)(() => Photograph_1.Photograph, { nullable: true }),
    __metadata("design:type", Photograph_1.Photograph)
], PhotographReturnType.prototype, "photograph", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PhotographError_1.PhotographError, { nullable: true }),
    __metadata("design:type", PhotographError_1.PhotographError)
], PhotographReturnType.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PhotographReturnType.prototype, "message", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Photograph_1.Photograph], { nullable: true }),
    __metadata("design:type", Array)
], PhotographReturnType.prototype, "images", void 0);
PhotographReturnType = __decorate([
    (0, type_graphql_1.ObjectType)()
], PhotographReturnType);
exports.PhotographReturnType = PhotographReturnType;
//# sourceMappingURL=PhotographReturnType.js.map