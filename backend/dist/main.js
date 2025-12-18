"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Data Dictionary API running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map