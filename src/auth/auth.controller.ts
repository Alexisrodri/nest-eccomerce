import { Controller, Post, Body, Get, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from './decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(
    @GetUser() user: User,
    @RawHeaders() rawHeaders: string[]
    // @GetUser('email') userEmail: string
    // @Req() request: Express.Request
  ) {
    return {
      ok: true,
      msg: 'Hola private',
      user,
      // userEmail
      rawHeaders
    }
  }

  @Get('private2')
  @UseGuards(AuthGuard())
  privateRoute2(
    @GetUser() user: User
  ) {
    return { ok: true, msg: 'ok' }
  }

}
