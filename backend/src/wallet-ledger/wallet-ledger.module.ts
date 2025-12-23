import { forwardRef, Module } from '@nestjs/common';
import { WalletLedgerService } from './wallet-ledger.service';
import { WalletLedgerController } from './wallet-ledger.controller';
import { WalletLedger } from './wallet-ledger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionModule } from '@/submission/submission.module';

@Module({
  imports: [TypeOrmModule.forFeature([WalletLedger]), forwardRef(() => SubmissionModule)],
  providers: [WalletLedgerService],
  controllers: [WalletLedgerController],
  exports: [WalletLedgerService],
})
export class WalletLedgerModule {}
