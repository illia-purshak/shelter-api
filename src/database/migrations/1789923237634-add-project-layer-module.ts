import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectLayerModule1789923237634 implements MigrationInterface {
    name = 'AddProjectLayerModule1789923237634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "layer" ("id" integer NOT NULL, "position" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "icon" character varying, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_d60eea04485b8109a4bc1e09c64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "layer" ADD CONSTRAINT "FK_cd6484f70a2d074f5ea324a0c34" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "layer" DROP CONSTRAINT "FK_cd6484f70a2d074f5ea324a0c34"`);
        await queryRunner.query(`DROP TABLE "layer"`);
    }

}
