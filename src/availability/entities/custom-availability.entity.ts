import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';

import { Doctor } from '../../doctor/entities/doctor.entity';

@Entity('custom_availability')
export class CustomAvailability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'date',
    })
    date: string;

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