"use strict";
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        // Enable CORS for frontend communication
        app.enableCors({
            origin: ((_a = process.env.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [
                'http://localhost:4200',
                'http://localhost:4201',
                'http://localhost:3000',
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        });
        const port = process.env.PORT || 3000;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}`);
        common_1.Logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        common_1.Logger.log(`🌐 CORS Origins: ${process.env.CORS_ORIGINS || 'localhost:4200,4201,3000'}`);
        common_1.Logger.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map