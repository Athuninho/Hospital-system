"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const common_1 = require("@nestjs/common");
class PasswordService {
    static validateStrength(password, userInputs = []) {
        const result = (0, zxcvbn_1.default)(password, userInputs);
        // zxcvbn score: 0 (worst) - 4 (best). Require at least 3 for production.
        if (result.score < 3) {
            throw new common_1.BadRequestException('Password too weak');
        }
        return true;
    }
}
exports.PasswordService = PasswordService;
//# sourceMappingURL=password.service.js.map