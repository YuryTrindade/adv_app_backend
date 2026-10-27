import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/IUserRepository';

export interface LoginDTO {
  email: string;
  password?: string;
}

export class AuthUseCases {
  constructor(private readonly userRepository: IUserRepository) { }

  async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    const { passwordHash, ...profile } = user;

    return {
      token,
      user: { id: user.id, email: user.email },
      profile,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Utilizador não encontrado.');
    }

    const { passwordHash, ...profile } = user;

    return {
      user: { id: user.id, email: user.email },
      profile,
    };
  }
}