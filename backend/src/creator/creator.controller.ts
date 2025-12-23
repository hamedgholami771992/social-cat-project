import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { Creator } from './creator.entity';

@Controller('creators')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Post()
  create(@Body() dto: CreateCreatorDto): Promise<Creator> {
    return this.creatorService.create(dto);
  }

  @Get()
  findAll(): Promise<Creator[]> {
    return this.creatorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Creator> {
    return this.creatorService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.creatorService.remove(id);
  }
}
