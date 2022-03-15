import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VoteDto } from './dto/vote.dto';
import { Vote } from './entities/vote.entity';
import { VoteDocument } from './schemas/vote.schema';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel('VotesCollection') private voteModel: Model<VoteDocument>,
  ) {}

  async create(createVoteDto: CreateVoteDto, owner: string) {
    const voteFormat: Vote = {
      scroe: Array(createVoteDto.select.length).fill(0),
      voted: [],
      owner: '',
      ...createVoteDto,
    };
    voteFormat.owner = owner;
    const create = new this.voteModel(voteFormat);
    return create.save();
  }

  async vote(id: string, vote: VoteDto) {
    const data = await this.findOne(id);
    const index = data.select.indexOf(vote.select);
    if (index == -1) {
      return null;
    }
    return this.voteModel.updateOne(
      { _id: id },
      { $push: { voted: id } },
      {
        $inc: {
          score: {
            $each: 1,
            $position: index,
          },
        },
      },
    );
  }

  async findAll() {
    return this.voteModel.find().exec();
  }

  async findPostAll(idgroup: string) {
    return this.voteModel.findOne({ idgroup: idgroup }).exec();
  }

  async findOne(id: string) {
    return this.voteModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateVoteDto: UpdateVoteDto) {
    return this.voteModel.updateOne(
      { _id: id },
      { $set: { ...updateVoteDto } },
    );
  }

  async remove(id: string) {
    return this.voteModel.deleteOne({ _id: id });
  }
}
