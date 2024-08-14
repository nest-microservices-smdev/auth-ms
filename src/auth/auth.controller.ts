import { MessagePattern, Payload } from '@nestjs/microservices';

import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.regiter.user' })
  async registerUser(@Payload() data: any) {
    return {
      data,
      message: 'User registered successfully',
    };
  }

  @MessagePattern({ cmd: 'auth.login.user' })
  loginUser() {}

  @MessagePattern({ cmd: 'auth.verify.user' })
  verifyToken() {}
}
