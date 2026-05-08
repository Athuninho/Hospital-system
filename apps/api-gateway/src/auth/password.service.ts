import zxcvbn from 'zxcvbn';
import { BadRequestException } from '@nestjs/common';

export class PasswordService {
  static validateStrength(password: string, userInputs: string[] = []) {
    const result = zxcvbn(password, userInputs);
    // zxcvbn score: 0 (worst) - 4 (best). Require at least 3 for production.
    if (result.score < 3) {
      throw new BadRequestException('Password too weak');
    }
    return true;
  }
}
