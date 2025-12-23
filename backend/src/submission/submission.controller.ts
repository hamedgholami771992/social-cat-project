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
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-submission-status.dto';
import { Submission } from './submission.entity';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() dto: CreateSubmissionDto): Promise<Submission> {
    return this.submissionService.create(dto);
  }

  @Get()
  findAll(): Promise<Submission[]> {
    return this.submissionService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string): Promise<Submission[]> {
    return this.submissionService.findByCampaign(campaignId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Submission> {
    return this.submissionService.findOne(id);
  }

  // approval / rejection
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSubmissionStatusDto,
  ): Promise<Submission> {
    return this.submissionService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.submissionService.remove(id);
  }
}
