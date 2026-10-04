import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskSeed1791103067099 implements MigrationInterface {
    name = 'CreateTaskSeed1791103067099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_seed" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_170a7562f8827511186076a9a36" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task_seed"`);
    }

}
