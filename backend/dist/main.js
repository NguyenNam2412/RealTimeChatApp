"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const csurf_1 = __importDefault(require("csurf"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    // catch shutdown signals
    app.enableShutdownHooks();
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((0, csurf_1.default)({
        cookie: true
    }));
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(process.env.PORT || 5000);
}
bootstrap();
