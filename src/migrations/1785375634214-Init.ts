import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1785375634214 implements MigrationInterface {
  name = 'Init1785375634214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "doctors" (
                "id" SERIAL NOT NULL,
                "fullName" character varying NOT NULL,
                "specialization" character varying NOT NULL,
                "experience" integer NOT NULL,
                "qualification" character varying NOT NULL,
                "consultationFee" numeric(10,2) NOT NULL,
                "availability" character varying NOT NULL,
                "profileDetails" character varying,
                "userId" integer,
                CONSTRAINT "REL_doctors_user" UNIQUE ("userId"),
                CONSTRAINT "PK_doctors_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "doctors"
            ADD CONSTRAINT "FK_doctors_user"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            CREATE TABLE "patients" (
                "id" SERIAL NOT NULL,
                "fullName" character varying NOT NULL,
                "age" integer NOT NULL,
                "gender" character varying NOT NULL,
                "contactDetails" character varying NOT NULL,
                "healthInformation" character varying,
                "userId" integer,
                CONSTRAINT "REL_patients_user" UNIQUE ("userId"),
                CONSTRAINT "PK_patients_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "patients"
            ADD CONSTRAINT "FK_patients_user"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_patients_user"`);
    await queryRunner.query(`DROP TABLE "patients"`);

    await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT "FK_doctors_user"`);
    await queryRunner.query(`DROP TABLE "doctors"`);
  }
}