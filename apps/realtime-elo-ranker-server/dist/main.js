"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        snapshot: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Realtime Elo Ranker API')
        .setDescription("Documentation de l'API de classement Elo")
        .setVersion('1.0')
        .addTag('ranking')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.enableCors();
    await app.listen(8080);
    console.log(`Application is running on: http://localhost:8080`);
    console.log(`Swagger Docs: http://localhost:8080/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map