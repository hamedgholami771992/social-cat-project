import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Submission } from '../submission/submission.entity';

export enum LedgerType {
  HOLD = 'HOLD',
  RELEASE = 'RELEASE',
}

@Entity()
@Unique(['submission', 'type'])
export class WalletLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Submission, { nullable: false })
  @JoinColumn({ name: 'submissionId' })
  submission: Submission;

  @Column({
    type: 'enum',
    enum: LedgerType,
  })
  type: LedgerType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
