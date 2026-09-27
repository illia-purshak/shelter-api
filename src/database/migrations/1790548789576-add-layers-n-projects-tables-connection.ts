import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLayersNProjectsTablesConnection1790548789576 implements MigrationInterface {
    name = 'AddLayersNProjectsTablesConnection1790548789576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layer" DROP CONSTRAINT "FK_cd6484f70a2d074f5ea324a0c34"`);
        await queryRunner.query(`ALTER TABLE "layer" ALTER COLUMN "projectId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "layer" ADD CONSTRAINT "FK_cd6484f70a2d074f5ea324a0c34" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layer" DROP CONSTRAINT "FK_cd6484f70a2d074f5ea324a0c34"`);
        await queryRunner.query(`ALTER TABLE "layer" ALTER COLUMN "projectId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "layer" ADD CONSTRAINT "FK_cd6484f70a2d074f5ea324a0c34" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
