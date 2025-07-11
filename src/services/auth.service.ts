import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { SignupInput, LoginInput } from '../schemas/auth.schema';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  async signup(data: SignupInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(409, 'User already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

export const authService = new AuthService();