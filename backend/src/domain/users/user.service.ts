import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from './user.repository';
import { RegisterDto, LoginDto } from './user.dto';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { config } from '../../config/config';
import { User, UserRole } from '@prisma/client';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async register(dto: RegisterDto): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    // Check if user exists
    const existingUser = await this.repository.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictError('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.repository.create(dto.username, passwordHash, dto.role);

    // Generate token
    const token = this.generateAccessToken(user.id, user.username, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login(dto: LoginDto): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    // Find user
    const user = await this.repository.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = this.generateAccessToken(user.id, user.username, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getProfile(userId: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private generateAccessToken(id: number, username: string, role: UserRole): string {
    return jwt.sign({ id, username, role }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    });
  }
}
