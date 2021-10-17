"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2 = __importStar(require("argon2"));
const error_1 = require("./error");
let UserDataInput = class UserDataInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDataInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDataInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDataInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDataInput.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserDataInput.prototype, "lastName", void 0);
UserDataInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserDataInput);
let UserReturnType = class UserReturnType {
};
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserReturnType.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [error_1.DbError], { nullable: true }),
    __metadata("design:type", Array)
], UserReturnType.prototype, "errors", void 0);
UserReturnType = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserReturnType);
let UserResolver = class UserResolver {
    me({ em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            const user = yield em.findOne(User_1.User, { userID: req.session.userId });
            return user;
        });
    }
    users({ em }) {
        return em.find(User_1.User, {});
    }
    user(id, { em }) {
        return em.findOne(User_1.User, { userID: id });
    }
    register({ username, password, firstName, lastName, email }, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username || !password || !firstName || !lastName || !email) {
                    return {
                        errors: [{
                                field: "empty",
                                message: "All fields are required in order to proceed."
                            }]
                    };
                }
                const hashedPassword = yield argon2.hash(password);
                const user = em.create(User_1.User, { username, password: hashedPassword, firstName, lastName, email });
                yield em.persistAndFlush(user);
                req.session.userId = user.userID;
                return { user, };
            }
            catch (error) {
                console.error(error);
                if (error.constraint === "user_email_unique")
                    return {
                        errors: [{
                                field: "email",
                                message: "This email is used by another user."
                            }]
                    };
                if (error.constraint === "user_username_unique")
                    return {
                        errors: [{
                                field: "username",
                                message: "This username is taken."
                            }]
                    };
                return {
                    errors: [{
                            field: "database",
                            message: "An internal server error occured. Please, try again later!"
                        }]
                };
            }
        });
    }
    login(username, password, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield em.findOne(User_1.User, { username: username });
                if (!user) {
                    return {
                        errors: [{
                                field: "username",
                                message: "This username does not exist."
                            }]
                    };
                }
                const passwordIsValid = yield argon2.verify(user.password, password);
                if (!passwordIsValid) {
                    return {
                        errors: [{
                                field: "password",
                                message: "Your credentials are invalid."
                            }]
                    };
                }
                req.session.userId = user.userID;
                return {
                    user,
                };
            }
            catch (error) {
                console.log("error");
                return {
                    errors: [{
                            field: " database",
                            message: "An internal server error occured. Please, try again later!"
                        }]
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserReturnType),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDataInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserReturnType),
    __param(0, (0, type_graphql_1.Arg)("username")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map