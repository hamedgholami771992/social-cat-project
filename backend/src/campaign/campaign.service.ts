import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from './campaign.entity';
import { Brand } from '../brand/brand.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { BrandService } from '@/brand/brand.service';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,

    @Inject()
    private readonly brandService: BrandService,
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const brand = await this.brandService.findOne(dto.brandId);

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    // if (new Date(dto.startDate) > new Date(dto.endDate)) {
    //   throw new BadRequestException('startDate must be before endDate');
    // }

    if (isNaN(Number(dto.budget))) {
      throw new BadRequestException('Invalid budget');
    }

    const campaign = this.campaignRepository.create({
      title: dto.title,
      description: dto.description,
      budget: Number(dto.budget),
      //   startDate: new Date(dto.startDate),
      //   endDate: new Date(dto.endDate),
      status: dto.status ?? CampaignStatus.DRAFT,
      brand,
    });

    return this.campaignRepository.save(campaign);
  }

  async save(campaign: Campaign): Promise<Campaign> {
    return this.campaignRepository.save(campaign);
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignRepository.find({
      relations: ['brand'],
    });
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['brand'],
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);

    // if (dto.startDate && dto.endDate) {
    //   if (new Date(dto.startDate) > new Date(dto.endDate)) {
    //     throw new BadRequestException('startDate must be before endDate');
    //   }
    // }

    if (dto.budget !== undefined) {
      const budget = Number(dto.budget);
      if (Number.isNaN(budget)) {
        throw new BadRequestException('Invalid budget');
      }
      campaign.budget = budget;
    }

    if (dto.brandId) {
      const brand = await this.brandService.findOne(dto.brandId);

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      campaign.brand = brand;
    }

    if (dto.title !== undefined) {
      campaign.title = dto.title;
    }

    if (dto.description !== undefined) {
      campaign.description = dto.description;
    }

    if (dto.status !== undefined) {
      campaign.status = dto.status;
    }

    // if (dto.startDate !== undefined) {
    //     campaign.startDate = new Date(dto.startDate);
    // }

    // if (dto.endDate !== undefined) {
    //     campaign.endDate = new Date(dto.endDate);
    // }

    return this.campaignRepository.save(campaign);
  }

  async remove(id: string): Promise<void> {
    const campaign = await this.findOne(id);
    await this.campaignRepository.remove(campaign);
  }
}
