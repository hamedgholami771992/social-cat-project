import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { LedgerType } from '../wallet-ledger.entity';

export class CreateWalletLedgerDto {
  @IsUUID()
  submissionId: string;

  @IsEnum(LedgerType)
  type: LedgerType;

  @IsNumber()
  amount: number;
}
