import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateMeDto } from './dto/update-me.dto';

type PublicUser = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class AuthService {
  private readonly saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  private readonly sessionName = process.env.SESSION_NAME ?? 'sid';

  constructor(private readonly usersService: UsersService) {}

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private saveSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.save((err) => (err ? reject(err) : resolve()));
    });
  }

  async register(dto: RegisterDto, req: Request): Promise<PublicUser> {
    const email = dto.email.trim().toLowerCase();
    const name = dto.name.trim();
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email уже используется');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = await this.usersService.createUser({
      name,
      email,
      passwordHash,
      role: Role.USER,
    });

    req.session.userId = user.id;
    await this.saveSession(req);
    return this.toPublicUser(user);
  }

  async login(dto: LoginDto, req: Request): Promise<PublicUser> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    req.session.userId = user.id;
    await this.saveSession(req);
    return this.toPublicUser(user);
  }

  async logout(req: Request, res: Response): Promise<{ success: true }> {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    res.clearCookie(this.sessionName);
    return { success: true };
  }

  async me(req: Request): Promise<PublicUser> {
    const userId = req.session.userId;
    if (!userId) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return this.toPublicUser(user);
  }

  async updateMe(dto: UpdateMeDto, req: Request): Promise<PublicUser> {
    const userId = req.session.userId;
    if (!userId) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const data: {
      name?: string;
      email?: string;
      passwordHash?: string;
    } = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      const existing = await this.usersService.findByEmail(email);
      if (existing && existing.id !== user.id) {
        throw new BadRequestException('Email уже используется');
      }
      data.email = email;
    }

    if (dto.newPassword || dto.confirmPassword || dto.currentPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Введите текущий пароль');
      }
      if (!dto.newPassword || !dto.confirmPassword) {
        throw new BadRequestException('Введите новый пароль и подтверждение');
      }
      if (dto.newPassword !== dto.confirmPassword) {
        throw new BadRequestException('Пароли не совпадают');
      }

      const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Текущий пароль указан неверно');
      }
      data.passwordHash = await bcrypt.hash(dto.newPassword, this.saltRounds);
    }

    const updated = await this.usersService.updateUser(user.id, data);
    return this.toPublicUser(updated);
  }
}
