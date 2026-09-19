import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectsTable1789828331120 implements MigrationInterface {
    name = 'CreateProjectsTable1789828331120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "icon" character varying, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
