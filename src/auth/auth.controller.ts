import { Controller, Post, Body, Get, UseGuards, Request, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from './decorator';
import { User } from './entities/user.entity';
import { UseroleGuard } from './guards/userole/userole.guard';
import { RoleProtected } from './decorator/role-protected/role-protected.decorator';
import { roles } from './interfaces';

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
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(roles.user)
  @UseGuards(AuthGuard(), UseroleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return { ok: true, user }
  }

}
