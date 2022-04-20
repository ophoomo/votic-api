import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';
import { MemberDocument } from './schemas/member.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('MembersCollection')
    private memberModel: Model<MemberDocument>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const memberFormat: Member = {
      group: [],
      salt: '',
      gender: false,
      ...createMemberDto,
    };
    memberFormat.salt = await bcrypt.genSalt();
    memberFormat.password = await bcrypt.hash(
      memberFormat.password,
      memberFormat.salt,
    );
    const create = new this.memberModel(memberFormat);
    return create.save();
  }

  async join(idMember: string, idGroup: string) {
    return this.memberModel.updateOne(
      { _id: idMember },
      { $push: { group: idGroup } },
    );
  }

  async leave(idGroup: string, idMember: string) {
    return this.memberModel.updateOne(
      { _id: idMember },
      { $pull: { group: idGroup } },
    );
  }

  async findAll() {
    return this.memberModel.find().exec();
  }

  async findOne(id: string) {
    return this.memberModel.findOne({ _id: id }).exec();
  }

  async findOneWithUsername(username: string) {
    return this.memberModel.findOne({ username: username }).exec();
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    return this.memberModel.updateOne(
      {
        _id: id,
      },
      {
        $set: { ...updateMemberDto },
      },
    );
  }

  async password(id: string, data: string) {
    const salt = await bcrypt.genSalt();
    const passwordEncode = await bcrypt.hash(data, salt);
    return this.memberModel.updateOne(
      {
        _id: id,
      },
      {
        $set: { password: passwordEncode, salt: salt },
      },
    );
  }

  async remove(id: number) {
    return this.memberModel.deleteOne({ _id: id });
  }
}
