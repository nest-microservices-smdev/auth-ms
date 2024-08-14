import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  onModuleInit() {
    try {
      this.$connect();
      this.logger.log('Prisma client connected: MongoDB');
    } catch (error) {
      this.logger.error(error);
    }
  }

  async registerUser({ email, name, password }: CreateUserDto) {
    try {
      const user = await this.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        throw new RpcException({
          statusCode: 400,
          message: 'User already exists',
        });
      }

      const newUser = await this.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(password, 10),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __, ...userWithoutPassword } = newUser;

      return userWithoutPassword;
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }
}
