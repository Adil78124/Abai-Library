import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  passwordHash?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return user?.role === Role.ADMIN;
  }

  async createUser(data: CreateUserData) {
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          role: data.role ?? Role.USER,
        },
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'P2002') {
        throw new BadRequestException('Email уже используется');
      }
      throw err;
    }
  }

  async updateUser(id: string, data: UpdateUserData) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'P2002') {
        throw new BadRequestException('Email уже используется');
      }
      throw err;
    }
  }
}
