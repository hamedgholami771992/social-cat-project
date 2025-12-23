import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumberString,
  MaxLength,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { CampaignStatus } from '../campaign.entity';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Decimal comes as string
  @IsNumber()
  budget: string;

  //   @IsDateString()
  //   startDate: string;

  //   @IsDateString()
  //   endDate: string;

  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
