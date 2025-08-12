"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const portfolio_controller_1 = require("./controllers/portfolio.controller");
const portfolio_service_1 = require("./services/portfolio.service");
const portfolio_schema_1 = require("./schemas/portfolio.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
                    dbName: process.env.MONGODB_DB_NAME || 'stock-management',
                }),
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: portfolio_schema_1.Portfolio.name, schema: portfolio_schema_1.PortfolioSchema },
            ]),
        ],
        controllers: [app_controller_1.AppController, portfolio_controller_1.PortfolioController],
        providers: [app_service_1.AppService, portfolio_service_1.PortfolioService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map