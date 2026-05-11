"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const billing_service_1 = require("./billing.service");
const mpesa_service_1 = require("./mpesa.service");
const billing_controller_1 = require("./billing.controller");
const prisma_1 = require("@hospital/prisma");
let BillingModule = class BillingModule {
};
BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        providers: [billing_service_1.BillingService, mpesa_service_1.MpesaService],
        controllers: [billing_controller_1.BillingController],
        exports: [billing_service_1.BillingService],
    })
], BillingModule);
exports.BillingModule = BillingModule;
