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
exports.Photograph = void 0;
const User_1 = require("./User");
const Location_1 = require("./Location");
const typeorm_1 = require("typeorm");
let Photograph = class Photograph extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Photograph.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bytea" }),
    __metadata("design:type", Buffer)
], Photograph.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.userID),
    __metadata("design:type", User_1.User)
], Photograph.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Location_1.Location, (location) => location.id),
    __metadata("design:type", Location_1.Location)
], Photograph.prototype, "location", void 0);
Photograph = __decorate([
    (0, typeorm_1.Entity)()
], Photograph);
exports.Photograph = Photograph;
//# sourceMappingURL=Photograph.js.map