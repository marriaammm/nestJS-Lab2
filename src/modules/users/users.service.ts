import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) { }

  async signUp(dto) {
    dto.password = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userModel.create(dto);
    return newUser;
  }

  async signIn(dto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(dto.password, user.password);
      const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
      const token = jwt.sign(
        { email: user.email, roles: [user.role] },
        jwtSecret,
        { expiresIn: '1d' },
      );
      return { token };
    }
    catch (error) {
      console.error('SignIn Error:', error);
      throw error;
    }
  }

  async myProfile(email: string) {
    return this.userModel.findOne({ email });
  }

  async getAllUsers(currentEmail: string) {
    return this.userModel.find({ email: { $ne: currentEmail } });
  }
}
