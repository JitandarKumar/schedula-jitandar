import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from '../doctor/entities/doctor.entity';
import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { UpdateRecurringAvailabilityDto } from './dto/update-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';
import { UpdateCustomAvailabilityDto } from './dto/update-custom-availability.dto';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,

        @InjectRepository(RecurringAvailability)
        private readonly recurringRepository: Repository<RecurringAvailability>,

        @InjectRepository(CustomAvailability)
        private readonly customRepository: Repository<CustomAvailability>,
    ) { }

    private isTimeOverlap(
        startTime: string,
        endTime: string,
        existingStartTime: string,
        existingEndTime: string,
    ): boolean {
        return (
            startTime < existingEndTime &&
            endTime > existingStartTime
        );
    }

    async createRecurringAvailability(
        user: JwtPayload,
        createRecurringAvailabilityDto: CreateRecurringAvailabilityDto,
    ) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        const {
            dayOfWeek,
            startTime,
            endTime,
        } = createRecurringAvailabilityDto;

        if (startTime >= endTime) {
            throw new BadRequestException(
                'End time must be later than start time.',
            );
        }

        const existingAvailabilities =
            await this.recurringRepository.find({
                where: {
                    doctor: {
                        id: doctor.id,
                    },
                    dayOfWeek,
                },
            });

        for (const availability of existingAvailabilities) {
            if (
                this.isTimeOverlap(
                    startTime,
                    endTime,
                    availability.startTime,
                    availability.endTime,
                )
            ) {
                throw new ConflictException(
                    'Availability slot overlaps with an existing slot.',
                );
            }
        }

        const existingSlot =
            await this.recurringRepository.findOne({
                where: {
                    doctor: {
                        id: doctor.id,
                    },
                    dayOfWeek,
                    startTime,
                    endTime,
                },
            });

        if (existingSlot) {
            throw new ConflictException(
                'Availability already exists.',
            );
        }

        const availability =
            this.recurringRepository.create({
                ...createRecurringAvailabilityDto,
                doctor,
            });

        return this.recurringRepository.save(
            availability,
        );
    }

    // Add these methods inside AvailabilityService, BELOW createRecurringAvailability()

    async getRecurringAvailability(
        user: JwtPayload,
    ) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        return this.recurringRepository.find({
            where: {
                doctor: {
                    id: doctor.id,
                },
            },
            order: {
                id: 'ASC',
            },
        });
    }

    async updateRecurringAvailability(
        user: JwtPayload,
        id: number,
        updateRecurringAvailabilityDto: UpdateRecurringAvailabilityDto,
    ) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        const availability =
            await this.recurringRepository.findOne({
                where: {
                    id,
                    doctor: {
                        id: doctor.id,
                    },
                },
            });

        if (!availability) {
            throw new NotFoundException(
                'Availability not found.',
            );
        }

        Object.assign(
            availability,
            updateRecurringAvailabilityDto,
        );

        return this.recurringRepository.save(
            availability,
        );
    }

    async deleteRecurringAvailability(
        user: JwtPayload,
        id: number,
    ) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        const availability =
            await this.recurringRepository.findOne({
                where: {
                    id,
                    doctor: {
                        id: doctor.id,
                    },
                },
            });

        if (!availability) {
            throw new NotFoundException(
                'Availability not found.',
            );
        }

        await this.recurringRepository.remove(
            availability,
        );

        return {
            message:
                'Availability deleted successfully.',
        };
    }

    async createCustomAvailability(
        user: JwtPayload,
        createCustomAvailabilityDto: CreateCustomAvailabilityDto,
    ) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        const availability =
            this.customRepository.create({
                ...createCustomAvailabilityDto,
                doctor,
            });

        return this.customRepository.save(
            availability,
        );
    }

    async getCustomAvailability(
        user: JwtPayload,
        date: string,
    ) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        return this.customRepository.find({
            where: {
                doctor: {
                    id: doctor.id,
                },
                date,
            },
        });
    }
}