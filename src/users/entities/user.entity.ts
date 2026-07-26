import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { UserRole } from '../enums/user.role.enum';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    role: UserRole;

    @Column({
        default: true,
    })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Doctor, (doctor) => doctor.user)
    doctor?: Doctor;

    @OneToOne(() => Patient, (patient) => patient.user)
    patient?: Patient;
}