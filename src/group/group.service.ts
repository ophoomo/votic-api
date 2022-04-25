import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupDocument } from './schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('GroupsCollection') private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto, idMember: string) {
    const groupFormat: Group = {
      owner: '',
      code: '',
      member: [],
      ...createGroupDto,
    };
    groupFormat.owner = idMember;
    groupFormat.member.push(idMember);
    while (true) {
      groupFormat.code = await this.randomCode(6);
      const data = await this.findCode(groupFormat.code);
      if (data === null) {
        break;
      }
    }
    const create = new this.groupModel(groupFormat);
    return create.save();
  }

  async join(code: string, idMember: string) {
    return this.groupModel.updateOne(
      { code: code },
      { $push: { member: idMember } },
    );
  }

  async leave(idGroup: string, idMember: string) {
    return this.groupModel.updateOne(
      { _id: idGroup },
      { $pull: { member: idMember } },
    );
  }

  async changeOwner(idGroup: string, oldOwer: string) {
    const data = await this.findOne(idGroup);
    let idMember: string = oldOwer;
    if (data.member.length > 1) {
      while (true) {
        idMember = data.member[Math.floor(Math.random() * data.member.length)];
        if (idMember !== oldOwer) {
          break;
        }
      }
    }
    return this.groupModel.updateOne(
      { _id: idGroup },
      { $set: { owner: idMember } },
    );
  }

  async changeOwnerByOwner(idGroup: string, newOwner: string) {
    return this.groupModel.updateOne(
      { _id: idGroup },
      { $set: { owner: newOwner } },
    );
  }

  async findAll() {
    return this.groupModel.find().exec();
  }

  async findOne(id: string) {
    return this.groupModel.findOne({ _id: id }).exec();
  }

  async findCode(code: string) {
    return this.groupModel.findOne({ code: code }).exec();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupModel.updateOne(
      { _id: id },
      { $set: { ...updateGroupDto } },
    );
  }

  async remove(id: string) {
    return this.groupModel.deleteOne({ _id: id });
  }

  private async randomCode(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789' as string;
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
