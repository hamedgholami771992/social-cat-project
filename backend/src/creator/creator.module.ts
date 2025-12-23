import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from './creator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creator])],
  providers: [CreatorService],
  controllers: [CreatorController],
  exports: [CreatorService],
})
export class CreatorModule {}
