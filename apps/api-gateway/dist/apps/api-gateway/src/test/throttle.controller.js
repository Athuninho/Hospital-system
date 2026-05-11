"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottleTestController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
let ThrottleTestController = class ThrottleTestController {
    // low per-second limit useful for integration tests
    get() {
        return { ok: true };
    }
};
exports.ThrottleTestController = ThrottleTestController;
__decorate([
    (0, throttler_1.Throttle)({ limit: 5, ttl: 60 }),
    (0, common_1.Get)('throttle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThrottleTestController.prototype, "get", null);
exports.ThrottleTestController = ThrottleTestController = __decorate([
    (0, common_1.Controller)('test')
], ThrottleTestController);
//# sourceMappingURL=throttle.controller.js.map