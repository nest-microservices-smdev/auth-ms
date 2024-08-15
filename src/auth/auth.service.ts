import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    try {
      this.$connect();
      this.logger.log('Prisma client connected: MongoDB');
    } catch (error) {
      this.logger.error(error);
    }
  }

  async signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sub, iat, exp, ...user } = this.jwtService.verify(token);

      return {
        user,
        token: await this.signJwt(user),
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: 'Unauthorized',
      });
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

      return {
        userWithoutPassword,
        token: await this.signJwt(userWithoutPassword),
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  async loginUser({ email, password }: LoginUserDto) {
    try {
      const user = await this.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new RpcException({
          statusCode: 400,
          message: 'User or password is incorrect.',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: 400,
          message: 'User or password is incorrect.',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: __, ...userWithoutPassword } = user;

      return {
        userWithoutPassword,
        token: await this.signJwt(userWithoutPassword),
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }
}
