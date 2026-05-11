"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/core-clinical');
    const port = process.env.PORT ? Number(process.env.PORT) : 3333;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Core Clinical service running on http://localhost:${port}/api/core-clinical`);
}
bootstrap();
//# sourceMappingURL=main.js.map