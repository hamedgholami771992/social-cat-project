import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixWalletLedgerIndex1766436509517 implements MigrationInterface {
  name = 'FixWalletLedgerIndex1766436509517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaigns_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "budget" numeric(10,2) NOT NULL, "status" "public"."campaigns_status_enum" NOT NULL DEFAULT 'DRAFT', "startDate" TIMESTAMP, "endDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "brandId" uuid NOT NULL, CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "walletAddress" character varying, "email" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ed87ba6433d5f9c2e76bfa8884e" UNIQUE ("username"), CONSTRAINT "PK_b27dd693f7df17bbfc21f00166a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."submission_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "status" "public"."submission_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "campaignId" uuid NOT NULL, "creatorId" uuid NOT NULL, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_ledger_type_enum" AS ENUM('HOLD', 'RELEASE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_ledger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."wallet_ledger_type_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "submissionId" uuid NOT NULL, CONSTRAINT "UQ_79230e7da26dd9643aa81223421" UNIQUE ("submissionId", "type"), CONSTRAINT "PK_d925214b1961738af45cc6959af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_bcb94974e9817591fbf1b89739d" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_1a8ecf258f28cb4fa2dd32cd481" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_9cc58ba73cc153a85999c3dc77c" FOREIGN KEY ("creatorId") REFERENCES "creators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_ledger" ADD CONSTRAINT "FK_5e60ba86ed684fb006dc9c0ae75" FOREIGN KEY ("submissionId") REFERENCES "submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_ledger" DROP CONSTRAINT "FK_5e60ba86ed684fb006dc9c0ae75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_9cc58ba73cc153a85999c3dc77c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_1a8ecf258f28cb4fa2dd32cd481"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP CONSTRAINT "FK_bcb94974e9817591fbf1b89739d"`,
    );
    await queryRunner.query(`DROP TABLE "wallet_ledger"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_ledger_type_enum"`);
    await queryRunner.query(`DROP TABLE "submission"`);
    await queryRunner.query(`DROP TYPE "public"."submission_status_enum"`);
    await queryRunner.query(`DROP TABLE "creators"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum"`);
    await queryRunner.query(`DROP TABLE "brands"`);
  }
}
