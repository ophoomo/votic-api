import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Res,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateMemberPasswordDto } from './dto/update-member-password.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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

    this.memberService.create(createMemberDto);
    res.status(201).json({
      status: true,
      message: 'สมัครสมาชิกเสร็จสิ้น',
    });
  }

  // update is method update data member
  @Patch(':id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    this.memberService.update(id, updateMemberDto);
    res.status(200).json({
      status: true,
      message: 'แก้ไขข้อมูลส่วนตัวเสร็จสิ้น',
    });
  }

  // password is method update password member
  @Put(':id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async password(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() updateMemberPasswordDto: UpdateMemberPasswordDto,
  ) {
    this.memberService.password(id, updateMemberPasswordDto);
    res.status(200).json({
      status: true,
      message: 'เปลื่ยนรหัสผ่านสำเร็จ',
    });
  }

  // remove is method delete data member
  @Delete(':id')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number, @Res() res: Response) {
    this.memberService.remove(id);
    res.status(200).json({
      status: true,
      message: 'ลบข้อมูลเสร็จสิ้น',
    });
  }
}
