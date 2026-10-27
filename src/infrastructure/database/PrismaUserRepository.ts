import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../../application/repositories/IUserRepository';

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }
}