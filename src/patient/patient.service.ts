import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from './entities/patient.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
    ) { }

    // Create Patient Profile
    async createProfile(
        user: JwtPayload,
        createPatientProfileDto: CreatePatientProfileDto,
    ) {
        const existingProfile = await this.patientRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (existingProfile) {
            throw new ConflictException(
                'Patient profile already exists.',
            );
        }

        const patient = this.patientRepository.create({
            ...createPatientProfileDto,
            user: {
                id: user.userId,
            },
        });

        return this.patientRepository.save(patient);
    }

    // Get Patient Profile
    async getProfile(user: JwtPayload) {
        const patient = await this.patientRepository.findOne({
            where: {
                user: {
                    id: user.userId,
                },
            },
        });

        if (!patient) {
            throw new NotFoundException(
                'Patient profile not found.',
            );
        }

        return patient;
    }

    // Update Patient Profile
    async updateProfile(
        user: JwtPayload,
        updatePatientProfileDto: UpdatePatientProfileDto,
    ) {
        const patient = await this.getProfile(user);

        Object.assign(patient, updatePatientProfileDto);

        return this.patientRepository.save(patient);
    }
}