import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.regiter.user' })
  async registerUser(@Payload() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @MessagePattern({ cmd: 'auth.login.user' })
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @MessagePattern({ cmd: 'auth.verify.user' })
  verifyToken() {}
}
