import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { MemberService } from 'src/member/member.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  @Version('1')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    const data = await this.memberService.findOneWithUsername(
      loginAuthDto.username,
    );
    if (data === null) {
      res.status(200).json({
        status: false,
        message: 'ไม่พบข้อมูล',
      });
      return;
    }
    const passwordEncode = await bcrypt.hash(loginAuthDto.password, data.salt);
    if (data.password !== passwordEncode) {
      res.status(200).json({
        status: false,
        message: 'รหัสผ่านไม่ถูกต้อง',
      });
      return;
    }
    const token = await this.jwtService.signAsync({
      id: data.id,
    });
    res.status(200).json({
      status: true,
      data: {
        token: token,
      },
    });
  }

  @Post('/verify')
  @UseGuards(JwtAuthGuard)
  @Version('1')
  async verify(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const data = await this.memberService.findOne(tokenDecode['id']);
    if (data === null) {
      res.status(200).json({
        status: false,
        message: 'ไม่พบข้อมูล',
      });
      return;
    }
    res.status(200).json({
      status: true,
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        group: data.group,
      },
    });
  }
}
