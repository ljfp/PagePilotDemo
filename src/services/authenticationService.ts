import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/client.js';
import { CreateUser, LoginCredentials, LoginResponse, UserResponse, JwtPayload } from '../models/User.js';
import { AppError } from '../utils/errors.js';
import { ErrorCode, HttpStatus } from '../types/index.js';

export class AuthenticationService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = '7d';
  private readonly SALT_ROUNDS = 12;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET not set in environment variables. Using fallback key.');
    }
  }

  async register(userData: CreateUser): Promise<UserResponse> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new AppError(
          'User with this email already exists',
          ErrorCode.CONFLICT,
          HttpStatus.CONFLICT
        );
      }

      const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to register user',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      });

      if (!user) {
        throw new AppError(
          'Invalid email or password',
          ErrorCode.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        throw new AppError(
          'Invalid email or password',
          ErrorCode.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };

      const accessToken = jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      });

      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        user: userResponse,
        accessToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to login',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
      return payload;
    } catch (error) {
      throw new AppError(
        'Invalid or expired token',
        ErrorCode.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
        { originalError: error }
      );
    }
  }

  async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return user;
    } catch (error) {
      throw new AppError(
        'Failed to get user',
        ErrorCode.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { originalError: error }
      );
    }
  }
}

export const authenticationService = new AuthenticationService(); 