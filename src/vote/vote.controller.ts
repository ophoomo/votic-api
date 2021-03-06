import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UseGuards,
  Res,
  Req,
  Put,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { VoteDto } from './dto/vote.dto';
import { JwtService } from '@nestjs/jwt';
import { GroupService } from 'src/group/group.service';

@Controller('vote')
@UseGuards(JwtAuthGuard)
export class VoteController {
  constructor(
    private readonly voteService: VoteService,
    private readonly jwtService: JwtService,
    private readonly groupService: GroupService,
  ) {}

  // create is method post vote for member
  @Post()
  @Version('1')
  async create(
    @Body() createVoteDto: CreateVoteDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    await this.voteService.create(createVoteDto, tokenDecode['id']);
    res.status(200).json({
      status: true,
      message: 'สร้างโพสเสร็จสิ้น',
    });
  }

  // vote is method vote for member
  @Post(':id/vote')
  @Version('1')
  async vote(
    @Body() voteDto: VoteDto,
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const post = await this.voteService.findOne(id);
    if (post === null) {
      res.status(200).json({
        status: false,
        message: 'ไม่พบข้อมูล',
      });
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkMemberStatus = await this.checkMember(
      post.idgroup,
      tokenDecode['id'],
    );
    if (!checkMemberStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ใช่สมาชิกในกลุ่มนี้',
      });
      return;
    }
    const checkVote = post.voted.find(item => item === id);
    if (checkVote !== undefined) {
      res.status(200).json({
        status: false,
        message: 'คุณโหวตแล้ว',
      });
      return;
    }
    await this.voteService.vote(id, voteDto, tokenDecode['id']);
    res.status(200).json({
      status: true,
      message: 'โหวตเสร็จสิ้น',
    });
  }

  // findvoteall is method find post vote all for member
  @Get(':id/post/all')
  @Version('1')
  async findvoteAll(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkmember = this.checkMember(id, tokenDecode['id']);
    if (!checkmember) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ได้อยู่ในกลุ่มนี้',
      });
      return;
    }
    res.status(200).json({
      status: true,
      message: 'ดึงข้อมูลเสร็จสิ้น',
      data: await this.voteService.findPostAll(id),
    });
  }

  // close is method close post
  @Put(":idgroup/:idpost/close")
  @Version('1')
  async close(
    @Param("idgroup") idgroup: string,
    @Param("idpost") idpost: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {    
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkOwnerStatus = await this.checkOwner(idgroup, tokenDecode['id']);
    const checkOwnerPostStatus = await this.checkOwnerPost(idpost, tokenDecode['id']);
    if (!checkOwnerPostStatus && !checkOwnerStatus) {
      if (!checkOwnerStatus) {
        res.status(200).json({
          status: false,
          message: 'คุณไม่ใช่เจ้าของกลุ่ม',
        });
        return;
      } else if (!checkOwnerPostStatus) {
        res.status(200).json({
          status: false,
          message: 'คุณไม่ใช่เจ้าของโพส',
        });
        return;
      } 
    }
    this.voteService.close(idpost);
    res.status(200).json({
      status: true,
      message: 'ปิดโพสเรียบร้อยแล้ว',
    });

  }

  // update is method update post vote for owner
  @Patch(':id')
  @Version('1')
  async update(
    @Param('id') id: string,
    @Body() updateVoteDto: UpdateVoteDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const data = await this.voteService.findOne(id);
    if (data === null) {
      res.status(200).json({
        status: false,
        message: 'ไม่พบข้อมูล',
      });
      return;
    }
    const checkOwnerStatus = await this.checkOwner(
      data.idgroup,
      tokenDecode['id'],
    );
    if (!checkOwnerStatus) {
      res.status(200).json({
        status: false,
        message: 'คุณไม่ใช่เจ้าของโพส',
      });
      return;
    }
    await this.voteService.update(id, updateVoteDto);
    res.status(200).json({
      status: true,
      message: 'แก้ไขข้อมูลเสร็จสิ้น',
    });
  }

  // remove is method remove post vote
  @Delete(':idgroup/:idpost')
  @Version('1')
  async remove(
    @Param('idgroup') idgroup: string,
    @Param('idpost') idpost: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecode = await this.jwtService.decode(token);
    const checkOwnerStatus = await this.checkOwner(idgroup, tokenDecode['id']);
    const checkOwnerPostStatus = await this.checkOwnerPost(idpost, tokenDecode['id']);
    if (!checkOwnerStatus && !checkOwnerPostStatus) {
      if (!checkOwnerStatus) {
        res.status(200).json({
          status: false,
          message: 'คุณไม่ใช่เจ้าของกลุ่ม',
        });
        return;
      }
      else if (!checkOwnerPostStatus) {
        res.status(200).json({
          status: false,
          message: 'คุณไม่ใช่เจ้าของโพส',
        });
        return;
      }
    }
    this.voteService.remove(idpost);
    res.status(200).json({
      status: true,
      message: 'ลบโพสเรียบร้อยแล้ว',
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

  // checkOwner is method check owner of group
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

  // checkOwnerPost is method check owner of post
  private async checkOwnerPost(
    idpost: string,
    idmember: string,
  ): Promise<boolean> {
    const vote = await this.voteService.findOne(idpost);
    if (vote.owner !== idmember) {
      return false;
    }
    return true;
  }
}
