import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Version,
  Delete,
  UseGuards,
  Res,
  Req,
  Put,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from 'src/member/member.service';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
  ) {}

  // findMemberGroup is method find group of member joined
  @Get(':id/member')
  @Version('1')
  async findMemberGroup(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkMemberStatus = await this.checkMember(id, tokenDecode['id']);
    if (!checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ได้อยู่ในกลุ่ม',
      });
      return;
    }
    const data = await this.groupService.findOne(id);
    if (data === null) {
      res.status(200).json({
        status: false,
        message: 'ไม่พบข้อมูล',
      });
      return;
    }
    const member = [];
    for (const item of data.member) {
      const dataMember = await this.memberService.findOne(item);
      if (dataMember !== null) {
        member.push({
          id: item,
          name: dataMember.firstname + ' ' + dataMember.lastname,
        });
      }
    }
    res.status(200).json({
      status: true,
      data: {
        member: member,
      },
    });
  }

  // findGroup is method find group
  @Get(':id')
  @Version('1')
  async findGroup(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkMemberStatus = await this.checkMember(id, tokenDecode['id']);
    if (!checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ได้อยู่ในกลุ่ม',
      });
      return;
    }
    const data = await this.groupService.findOne(id);
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
        id: data.id,
        code: data.code,
        name: data.name,
        owner: data.owner,
        member: data.member.length,
      },
    });
  }

  // joinGroup is method join group for member
  @Post(':code/join')
  @Version('1')
  async joinGroup(
    @Param('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const group = await this.groupService.findCode(code);
    if (group === null) {
      res.status(200).json({
        status: false,
        message: 'ไม่พบข้อมูล',
      });
      return;
    }
    const checkMemberStatus = await this.checkMember(
      group.id,
      tokenDecode['id'],
    );
    if (checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณเข้าร่วมกลุ่มอยู่แล้ว',
      });
      return;
    }
    await this.groupService.join(code, tokenDecode['id']);
    await this.memberService.join(tokenDecode['id'], group.id);
    res.status(200).json({
      status: true,
      message: 'เข้าร่วมกลุ่มเรียบร้อยแล้ว',
    });
  }

  // changeOwnerGroup is method change owner group
  @Put(':id/owner/:newowner')
  @Version('1')
  async changeOwnerGroup(
    @Param('id') id: string,
    @Param('newowner') idNewOwner: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkOwnerStatus = this.checkOwner(id, tokenDecode['id']);
    if (!checkOwnerStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ใช่เจ้าของกลุ่ม',
      });
      return;
    }
    const checkMemberStatus = await this.checkMember(id, idNewOwner);
    if (!checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'เขาไม่ได้อยู่ในกลุ่ม',
      });
      return;
    }
    await this.groupService.changeOwnerByOwner(id, idNewOwner);
    res.status(200).json({
      status: true,
      message: 'เปลื่ยนหัวหน้ากลุ่มเรียบร้อยแล้ว',
    });
  }

  // leave is method leave group for owner
  @Delete(':id/kick/:idmember')
  @Version('1')
  async kick(
    @Param('id') id: string,
    @Param('idmember') idMember: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkOwnerStatus = await this.checkOwner(id, tokenDecode['id']);
    if (!checkOwnerStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ใช่เจ้าของกลุ่ม',
      });
      return;
    }
    const checkMemberStatus = await this.checkMember(id, idMember);
    if (!checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'เขาไม่ได้อยู่ในกลุ่ม',
      });
      return;
    }
    await this.groupService.leave(id, idMember);
    await this.memberService.leave(id, idMember);
    res.status(200).json({
      status: true,
      message: 'ลบสมาชิกคนนี้เรียบร้อยแล้ว',
    });
  }

  // leave is method leave group for member
  @Delete(':id/leave')
  @Version('1')
  async leave(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkMemberStatus = await this.checkMember(id, tokenDecode['id']);
    if (!checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ได้อยู่ในกลุ่ม',
      });
      return;
    }
    const checkOwnerStatus = await this.checkOwner(id, tokenDecode['id']);
    if (checkOwnerStatus) {
      await this.groupService.changeOwner(id, tokenDecode['id']);
    }
    await this.groupService.leave(id, tokenDecode['id']);
    await this.memberService.leave(id, tokenDecode['id']);
    await this.checkRemoveGroup(id);
    res.status(200).json({
      status: true,
      message: 'ออกจากกลุ่มเรียบร้อย',
    });
  }

  // create is method create group for member
  @Post()
  @Version('1')
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const group = await this.groupService.create(
      createGroupDto,
      tokenDecode['id'],
    );
    await this.memberService.join(tokenDecode['id'], group.id);
    res.status(201).json({
      status: true,
      message: 'สร้างกลุ่มเสร็จสิ้น',
    });
  }

  // update is method update data group
  @Patch(':id')
  @Version('1')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkOwnerStatus = this.checkOwner(id, tokenDecode['id']);
    if (!checkOwnerStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ใช่เจ้าของกลุ่ม',
      });
      return;
    }
    await this.groupService.update(id, updateGroupDto);
    res.status(200).json({
      status: true,
      message: 'แก้ไขข้อมูลเสร็จสิ้น',
    });
  }

  // remove is method delete group
  @Delete(':id')
  @Version('1')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkOwnerStatus = this.checkOwner(id, tokenDecode['id']);
    if (!checkOwnerStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ใช่เจ้าของโพส',
      });
      return;
    }
    await this.groupService.remove(id);
    res.status(200).json({
      status: true,
      message: 'ลบกลุ่มเสร็จสิ้น',
    });
  }

  // checkMember is method check member in group
  private async checkMember(
    idgroup: string,
    idmember: string,
  ): Promise<boolean> {
    const group = await this.groupService.findOne(idgroup);
    const index = group.member.indexOf(idmember);
    if (index === -1) {
      return false;
    }
    return true;
  }

  // checkOwner is method check owner of post
  private async checkOwner(
    idgroup: string,
    idmember: string,
  ): Promise<boolean> {
    const group = await this.groupService.findOne(idgroup);
    if (group.owner !== idmember) {
      return false;
    }
    return true;
  }

  // checkRemoveGroup is method check member in group if member less or then 0 then remove group
  private async checkRemoveGroup(idgroup: string) {
    const group = await this.groupService.findOne(idgroup);
    if (group.member.length <= 0) {
      await this.groupService.remove(idgroup);
    }
  }
}
