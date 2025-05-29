import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userData = {
      ...dto,
      password: hashedPassword,
    };
    const newUser = await this.userModel.create(userData);
    return newUser;
  }

  async signIn(dto: SignInDto): Promise<{ token: string }> {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
      const token = jwt.sign(
        { email: user.email, roles: [user.role] },
        jwtSecret,
        { expiresIn: '1d' },
      );
      return { token };
    } catch (error) {
      console.error('SignIn Error:', error);
      throw error;
    }
  }

  async myProfile(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('-password');
  }

  async getAllUsers(currentEmail: string): Promise<User[]> {
    return this.userModel.find({ email: { $ne: currentEmail } }).select('-password');
  }
}