import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BrandModule } from './brand/brand.module';
import { CreatorModule } from './creator/creator.module';
import { CampaignModule } from './campaign/campaign.module';
import { SubmissionModule } from './submission/submission.module';
import { WalletLedgerModule } from './wallet-ledger/wallet-ledger.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    BrandModule,
    CreatorModule,
    CampaignModule,
    SubmissionModule,
    WalletLedgerModule,
  ],
})
export class AppModule {}
