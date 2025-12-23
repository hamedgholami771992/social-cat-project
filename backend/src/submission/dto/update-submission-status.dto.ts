import { IsEnum } from 'class-validator';
import { SubmissionStatus } from '../submission.entity';

export class UpdateSubmissionStatusDto {
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;
}
