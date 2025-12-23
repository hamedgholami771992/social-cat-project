import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletLedger, LedgerType } from './wallet-ledger.entity';
import { CreateWalletLedgerDto } from './dto/create-wallet-ledger.dto';
import { SubmissionService } from '@/submission/submission.service';

@Injectable()
export class WalletLedgerService {
  constructor(
    @InjectRepository(WalletLedger)
    private readonly ledgerRepo: Repository<WalletLedger>,

    @Inject(forwardRef(() => SubmissionService))
    private readonly submissionService: SubmissionService,
  ) {}

  async create(dto: CreateWalletLedgerDto): Promise<WalletLedger> {
    const submission = await this.submissionService.findOne(dto.submissionId);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const exists = await this.ledgerRepo.findOne({
      where: {
        submission: { id: submission.id },
        type: dto.type,
      },
      relations: ['submission'],
    });

    if (exists) {
      throw new ConflictException(`Ledger entry already exists for submission (${dto.type})`);
    }

    const ledger = this.ledgerRepo.create({
      submission,
      type: dto.type,
      amount: dto.amount,
    });

    return this.ledgerRepo.save(ledger);
  }

  async findAll(): Promise<WalletLedger[]> {
    return this.ledgerRepo.find({
      relations: ['submission'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySubmission(submissionId: string): Promise<WalletLedger[]> {
    return this.ledgerRepo.find({
      where: {
        submission: { id: submissionId },
      },
      relations: ['submission'],
      order: { createdAt: 'ASC' },
    });
  }

  async findBalanceBySubmission(submissionId: string): Promise<{ balance: number }> {
    const ledgers = await this.findBySubmission(submissionId);

    let balance = 0;

    for (const ledger of ledgers) {
      if (ledger.type === LedgerType.HOLD) {
        balance += Number(ledger.amount);
      }
      if (ledger.type === LedgerType.RELEASE) {
        balance -= Number(ledger.amount);
      }
    }

    return { balance };
  }
}
