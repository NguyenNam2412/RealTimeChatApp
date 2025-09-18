"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("./chat.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const group_entity_1 = require("../../entities/group.entity");
const user_entity_1 = require("../../entities/user.entity");
const message_entity_1 = require("../../entities/message.entity");
const message_module_1 = require("../messages/message.module");
const message_service_1 = require("../messages/message.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([group_entity_1.Group, group_entity_1.GroupMember, user_entity_1.User, message_entity_1.Message]),
            message_module_1.MessageModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    secret: config.get(process.env.JWT_SECRET) || process.env.JWT_SECRET,
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [chat_gateway_1.ChatGateway, message_service_1.MessageService],
        exports: [message_service_1.MessageService]
    })
], ChatModule);
