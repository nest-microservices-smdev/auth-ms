import { MessagePattern } from '@nestjs/microservices';

import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.regiter.user' })
  registerUser() {}

  @MessagePattern({ cmd: 'auth.login.user' })
  loginUser() {}

  @MessagePattern({ cmd: 'auth.verify.user' })
  verifyToken() {}
}
