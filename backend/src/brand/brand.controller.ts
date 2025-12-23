import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './brand.entity';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return await this.brandService.create(createBrandDto);
  }

  @Get()
  async findAll(): Promise<Brand[]> {
    return await this.brandService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Brand> {
    return await this.brandService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.brandService.remove(id);
  }
}
