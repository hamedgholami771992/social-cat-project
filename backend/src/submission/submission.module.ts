import { forwardRef, Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { Submission } from './submission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignModule } from '@/campaign/campaign.module';
import { CreatorModule } from '@/creator/creator.module';
import { WalletLedgerModule } from '@/wallet-ledger/wallet-ledger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    CreatorModule,
    CampaignModule,
    forwardRef(() => WalletLedgerModule),
  ],
  providers: [SubmissionService],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class SubmissionModule {}
