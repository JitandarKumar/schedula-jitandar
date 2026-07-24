import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user.role.enum';

@Controller('doctor')
export class DoctorController {
    @Get('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.DOCTOR)
    getProfile(@Req() request: any) {
        return {
            message: 'Doctor profile accessed successfully.',
            user: request.user,
        };
    }
}