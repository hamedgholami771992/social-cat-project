import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WalletLedgerService } from './wallet-ledger.service';
import { WalletLedger } from './wallet-ledger.entity';
import { CreateWalletLedgerDto } from './dto/create-wallet-ledger.dto';

@Controller('wallet-ledger')
export class WalletLedgerController {
  constructor(private readonly walletLedgerService: WalletLedgerService) {}

  // Internal / admin usage
  @Post()
  create(@Body() dto: CreateWalletLedgerDto): Promise<WalletLedger> {
    return this.walletLedgerService.create(dto);
  }

  @Get()
  findAll(): Promise<WalletLedger[]> {
    return this.walletLedgerService.findAll();
  }

  @Get('submission/:submissionId')
  findBySubmission(@Param('submissionId') submissionId: string): Promise<WalletLedger[]> {
    return this.walletLedgerService.findBySubmission(submissionId);
  }

  @Get('submission/:submissionId/balance')
  findBalance(@Param('submissionId') submissionId: string): Promise<{ balance: number }> {
    return this.walletLedgerService.findBalanceBySubmission(submissionId);
  }
}
