import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Creator } from './creator.entity';
import { CreateCreatorDto } from './dto/create-creator.dto';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(Creator)
    private readonly creatorRepository: Repository<Creator>,
  ) {}

  async create(dto: CreateCreatorDto): Promise<Creator> {
    const existing = await this.creatorRepository.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new ConflictException('Username already taken');
    }

    const creator = this.creatorRepository.create(dto);
    return this.creatorRepository.save(creator);
  }

  async findAll(): Promise<Creator[]> {
    return this.creatorRepository.find();
  }

  async findOne(id: string): Promise<Creator> {
    const creator = await this.creatorRepository.findOne({
      where: { id },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async remove(id: string): Promise<void> {
    const creator = await this.findOne(id);
    await this.creatorRepository.remove(creator);
  }
}
