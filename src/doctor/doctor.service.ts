import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './entities/doctor.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctor)
        private readonly doctorRepository: Repository<Doctor>,
    ) { }
    //create profile
    async createProfile(
        user: JwtPayload,
        createDoctorProfileDto: CreateDoctorProfileDto,
    ) {
        const userId = user.userId;
        const existingProfile = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
            },
        });


        if (existingProfile) {
            throw new ConflictException(
                'Doctor profile already exists.',
            );
        }

        const doctor = this.doctorRepository.create({
            ...createDoctorProfileDto,
            user: {
                id: userId,
            },
        });

        return this.doctorRepository.save(doctor);
    }

    // get profile
    async getProfile(user: JwtPayload) {
        const userId = user.userId;
        const doctor = await this.doctorRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
            },
        });

        if (!doctor) {
            throw new NotFoundException(
                'Doctor profile not found.',
            );
        }

        return doctor;
    }

    //update profile
    async updateProfile(
        user: JwtPayload,
        updateDoctorProfileDto: UpdateDoctorProfileDto,
    ) {
        const doctor = await this.getProfile(user);

        Object.assign(doctor, updateDoctorProfileDto);

        return this.doctorRepository.save(doctor);
    }

}