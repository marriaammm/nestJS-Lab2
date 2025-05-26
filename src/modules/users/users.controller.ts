import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTPayload } from 'src/lib/interfaces';


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('sign-up')
  signUp(@Body() dto: CreateUserDto) {
    return this.usersService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.usersService.signIn(dto);
  }

  @ApiBearerAuth()
  @Get('my-profile')
  myProfile(@GetUser() user: JWTPayload) {
    return this.usersService.myProfile(user.email);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Role('admin')
  @Get('all')
  getAll(@GetUser() user: JWTPayload) {
    return this.usersService.getAllUsers(user.email);
  }
}
