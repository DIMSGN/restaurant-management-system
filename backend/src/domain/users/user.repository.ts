import { prisma } from '../../config/database';
import { User, UserRole } from '@prisma/client';

export class UserRepository {
  async create(username: string, passwordHash: string, role: UserRole): Promise<User> {
    return await prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        // Exclude passwordHash
      },
    });
  }
}
