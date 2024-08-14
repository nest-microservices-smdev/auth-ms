import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NatsModule } from '../transports/nats.module';
import { envs } from '../config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    NatsModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
