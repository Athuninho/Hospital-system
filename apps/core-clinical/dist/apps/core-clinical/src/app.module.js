"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const patients_module_1 = require("./modules/patients/patients.module");
const encounters_module_1 = require("./modules/encounters/encounters.module");
const orders_module_1 = require("./modules/orders/orders.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const billing_module_1 = require("./modules/billing/billing.module");
const pharmacy_module_1 = require("./modules/pharmacy/pharmacy.module");
const lab_module_1 = require("./modules/lab/lab.module");
const wards_module_1 = require("./modules/wards/wards.module");
const prisma_1 = require("@hospital/prisma");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_1.PrismaModule,
            patients_module_1.PatientsModule,
            encounters_module_1.EncountersModule,
            orders_module_1.OrdersModule,
            appointments_module_1.AppointmentsModule,
            billing_module_1.BillingModule,
            pharmacy_module_1.PharmacyModule,
            lab_module_1.LabModule,
            wards_module_1.WardsModule,
        ],
        controllers: [],
        providers: []
    })
], AppModule);
//# sourceMappingURL=app.module.js.map