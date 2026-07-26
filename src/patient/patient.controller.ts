import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { UserRole } from '../users/enums/user.role.enum';

import { PatientService } from './patient.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
    ) { }

    // Create Patient Profile
    @Post('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PATIENT)
    createProfile(
        @CurrentUser() user: JwtPayload,
        @Body() createPatientProfileDto: CreatePatientProfileDto,
    ) {
        return this.patientService.createProfile(
            user,
            createPatientProfileDto,
        );
    }

    // Get Patient Profile
    @Get('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PATIENT)
    getProfile(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.patientService.getProfile(user);
    }

    // Update Patient Profile
    @Patch('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PATIENT)
    updateProfile(
        @CurrentUser() user: JwtPayload,
        @Body() updatePatientProfileDto: UpdatePatientProfileDto,
    ) {
        return this.patientService.updateProfile(
            user,
            updatePatientProfileDto,
        );
    }
}