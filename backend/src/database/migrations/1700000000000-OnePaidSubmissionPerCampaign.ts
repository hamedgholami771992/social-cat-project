import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnePaidSubmissionPerCampaign1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX submission_one_paid_per_campaign
      ON submission ("campaignId")
      WHERE status = 'PAID'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX submission_one_paid_per_campaign
    `);
  }
}
