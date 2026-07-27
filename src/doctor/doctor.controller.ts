import { Body, Controller, Get, Post, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user.role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Controller('doctor')
export class DoctorController {
    constructor(
        private readonly doctorService: DoctorService,
    ) { }
    // Post doctor profile
    @Post('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.DOCTOR)
    createProfile(
        @CurrentUser() user: JwtPayload,
        @Body() createDoctorProfileDto: CreateDoctorProfileDto,
    ) {
        return this.doctorService.createProfile(
            user,
            createDoctorProfileDto,
        );
    }
    // get doctor profile
    @Get('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.DOCTOR)
    getProfile(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.doctorService.getProfile(user);
    }

    // patch doctor profile
    @Patch('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.DOCTOR)
    updateProfile(
        @CurrentUser() user: JwtPayload,
        @Body() updateDoctorProfileDto: UpdateDoctorProfileDto,
    ) {
        return this.doctorService.updateProfile(
            user,
            updateDoctorProfileDto,
        );
    }
}