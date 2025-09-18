"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: process.env.DB_TYPE || 'postgres',
                    url: process.env.DB_URL,
                    // host: process.env.DB_HOST || 'localhost',
                    // port: Number(process.env.DB_PORT) || (process.env.DB_TYPE === 'sqlite' ? undefined : 5432),
                    // username: process.env.DB_USER,
                    // password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    logging: true,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: process.env.NODE_ENV === 'development', // dev only
                    migrations: [__dirname + '/migrations/*{.ts,.js}'],
                    // ...(process.env.DB_TYPE === 'sqlite' ? { database: process.env.DB_PATH || 'db.sqlite' } : {}),
                }),
            }),
        ],
    })
], DatabaseModule);
