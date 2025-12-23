import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './submission.entity';
import { CampaignService } from '@/campaign/campaign.service';
import { CreatorService } from '@/creator/creator.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { WalletLedgerService } from '@/wallet-ledger/wallet-ledger.service';
import { LedgerType } from '@/wallet-ledger/wallet-ledger.entity';
import { CampaignStatus } from '@/campaign/campaign.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,

    @Inject()
    private readonly campaignService: CampaignService,

    @Inject()
    private readonly creatorService: CreatorService,

    @Inject(forwardRef(() => WalletLedgerService))
    private readonly walletLedgerService: WalletLedgerService,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    const campaign = await this.campaignService.findOne(dto.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const creator = await this.creatorService.findOne(dto.creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const exists = await this.submissionRepository.findOne({
      where: {
        campaign: { id: campaign.id },
        creator: { id: creator.id },
      },
      relations: ['campaign', 'creator'],
    });

    if (exists) {
      throw new ConflictException('Creator already submitted to this campaign');
    }

    // Check if this is the first submission for the campaign
    const submissionCount = await this.submissionRepository.count({
      where: {
        campaign: { id: campaign.id },
      },
    });

    // Activate campaign if this is the first submission
    if (submissionCount === 0 && campaign.status === CampaignStatus.DRAFT) {
      campaign.status = CampaignStatus.ACTIVE;
      this.campaignService.save(campaign);
    }

    const submission = this.submissionRepository.create({
      content: dto.content,
      campaign,
      creator,
    });

    return this.submissionRepository.save(submission);
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionRepository.find({
      relations: ['campaign', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCampaign(campaignId: string): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { campaign: { id: campaignId } },
      relations: ['campaign', 'creator'],
    });
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: ['campaign', 'creator'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async updateStatus(id: string, nextStatus: SubmissionStatus): Promise<Submission> {
    const submission = await this.findOne(id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    const campaign = await this.campaignService.findOne(submission.campaign.id);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    switch (submission.status) {
      case SubmissionStatus.PENDING: {
        // only PENDING -> APPROVED | REJECTED is allowed
        if (nextStatus !== SubmissionStatus.APPROVED && nextStatus !== SubmissionStatus.REJECTED) {
          throw new BadRequestException('Invalid transition');
        }

        if (nextStatus === SubmissionStatus.APPROVED) {
          await this.walletLedgerService.create({
            submissionId: submission.id,
            type: LedgerType.HOLD,
            amount: submission.campaign.budget,
          });
        }

        submission.status = nextStatus;
        break;
      }

      case SubmissionStatus.APPROVED:
        // only APPROVED -> PAID | REJECTED is allowed
        if (nextStatus !== SubmissionStatus.PAID && nextStatus !== SubmissionStatus.REJECTED) {
          throw new BadRequestException('Invalid transition');
        }

        // Prevent multiple PAID submissions per campaign
        if (nextStatus === SubmissionStatus.PAID) {
          if (campaign.status === CampaignStatus.COMPLETED) {
            throw new ConflictException('Campaign already completed');
          }
          const alreadyPaid = await this.submissionRepository.exists({
            where: {
              campaign: { id: campaign.id },
              status: SubmissionStatus.PAID,
            },
          });

          if (alreadyPaid) {
            throw new ConflictException('A submission has already been paid for this campaign');
          }

          campaign.status = CampaignStatus.COMPLETED;
          await this.campaignService.save(campaign);
        }

        // APPROVED → PAID or REJECTED both RELEASE the HOLD
        await this.walletLedgerService.create({
          submissionId: submission.id,
          type: LedgerType.RELEASE,
          amount: submission.campaign.budget,
        });

        submission.status = nextStatus;
        break;

      default:
        throw new BadRequestException('Submission already finalized');
    }

    return this.submissionRepository.save(submission);
  }

  async remove(id: string): Promise<void> {
    const submission = await this.findOne(id);

    if (submission.status !== SubmissionStatus.PENDING) {
      throw new BadRequestException('Only pending submissions can be deleted');
    }

    await this.submissionRepository.remove(submission);
  }
}
