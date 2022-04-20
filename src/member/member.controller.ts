import {
  Controller,
  Post,
  Body,
  Patch,
  Version,
  Res,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
  ) {}

  // create is method register member
  @Post()
  @Version('1')
  async create(@Body() createMemberDto: CreateMemberDto, @Res() res: Response) {
    const data = await this.memberService.findOneWithUsername(
      createMemberDto.username,
    );

    if (data) {
      res.status(200).json({
        status: false,
        message: 'ชื่อผู้ใช้งานซ้ำ',
      });
      return;
    }

    await this.memberService.create(createMemberDto);
    res.status(201).json({
      status: true,
      message: 'สมัครสมาชิกเสร็จสิ้น',
    });
  }

  // update is method update data member
  @Patch('')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async update(
    @Res() res: Response,
    @Body() updateMemberDto: UpdateMemberDto,
    @Req() req: Request,
  ) {
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
    await this.memberService.update(tokenDecode['id'], updateMemberDto);
    res.status(200).json({
      status: true,
      message: 'แก้ไขข้อมูลส่วนตัวเสร็จสิ้น',
    });
  }

  // password is method update password member
  @Put('/password')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async password(
    @Res() res: Response,
    @Body() updateMemberPasswordDto: UpdateMemberPasswordDto,
    @Req() req: Request,
  ) {
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
    const passwordEncode = await bcrypt.hash(
      updateMemberPasswordDto.passwordold,
      data.salt,
    );
    if (passwordEncode !== data.password) {
      res.status(200).json({
        status: false,
        message: 'รหัสผ่านเดิมไม่ถูกต้อง',
      });
      return;
    }
    await this.memberService.password(
      tokenDecode['id'],
      updateMemberPasswordDto.passwordnew,
    );
    res.status(200).json({
      status: true,
      message: 'เปลื่ยนรหัสผ่านสำเร็จ',
    });
  }
}
