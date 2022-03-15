import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { VoteModule } from './vote/vote.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/
      ${process.env.DB_NAME}`,
    ),
    MemberModule,
    AuthModule,
    GroupModule,
    VoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
