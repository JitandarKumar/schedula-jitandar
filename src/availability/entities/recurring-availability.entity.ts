import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';

import { Doctor } from '../../doctor/entities/doctor.entity';

@Entity('recurring_availability')
export class RecurringAvailability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dayOfWeek: string;

    @Column({
        type: 'time',
    })
    startTime: string;

    @Column({
        type: 'time',
    })
    endTime: string;

    @ManyToOne(
        () => Doctor,
        {
            onDelete: 'CASCADE',
        },
    )
    doctor: Doctor;
}