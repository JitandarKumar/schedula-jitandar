import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1785384567214 implements MigrationInterface {
    name = 'Init1785384567214';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "recurring_availability" (
        "id" SERIAL NOT NULL,
        "dayOfWeek" character varying NOT NULL,
        "startTime" TIME NOT NULL,
        "endTime" TIME NOT NULL,
        "doctorId" integer,
        CONSTRAINT "PK_recurring_availability" PRIMARY KEY ("id")
      )
    `);

        await queryRunner.query(`
      CREATE TABLE "custom_availability" (
        "id" SERIAL NOT NULL,
        "date" date NOT NULL,
        "startTime" TIME NOT NULL,
        "endTime" TIME NOT NULL,
        "doctorId" integer,
        CONSTRAINT "PK_custom_availability" PRIMARY KEY ("id")
      )
    `);

        await queryRunner.query(`
      ALTER TABLE "recurring_availability"
      ADD CONSTRAINT "FK_recurring_doctor"
      FOREIGN KEY ("doctorId")
      REFERENCES "doctors"("id")
      ON DELETE CASCADE
    `);

        await queryRunner.query(`
      ALTER TABLE "custom_availability"
      ADD CONSTRAINT "FK_custom_doctor"
      FOREIGN KEY ("doctorId")
      REFERENCES "doctors"("id")
      ON DELETE CASCADE
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "custom_availability" DROP CONSTRAINT "FK_custom_doctor"`
        );

        await queryRunner.query(
            `ALTER TABLE "recurring_availability" DROP CONSTRAINT "FK_recurring_doctor"`
        );

        await queryRunner.query(`DROP TABLE "custom_availability"`);

        await queryRunner.query(`DROP TABLE "recurring_availability"`);
    }
}