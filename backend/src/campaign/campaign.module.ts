import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { BrandModule } from '@/brand/brand.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), BrandModule],
  providers: [CampaignService],
  controllers: [CampaignController],
  exports: [CampaignService],
})
export class CampaignModule {}
