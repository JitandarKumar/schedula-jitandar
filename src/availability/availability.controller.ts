import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { UserRole } from '../users/enums/user.role.enum';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { UpdateRecurringAvailabilityDto } from './dto/update-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';
import { UpdateCustomAvailabilityDto } from './dto/update-custom-availability.dto';

@Controller('doctor/availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class AvailabilityController {
    constructor(
        private readonly availabilityService: AvailabilityService,
    ) { }

    @Post()
    createRecurringAvailability(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateRecurringAvailabilityDto,
    ) {
        return this.availabilityService.createRecurringAvailability(
            user,
            dto,
        );
    }

    @Get()
    getRecurringAvailability(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.availabilityService.getRecurringAvailability(user);
    }

    @Patch(':id')
    updateRecurringAvailability(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: number,
        @Body() dto: UpdateRecurringAvailabilityDto,
    ) {
        return this.availabilityService.updateRecurringAvailability(
            user,
            id,
            dto,
        );
    }

    @Delete(':id')
    deleteRecurringAvailability(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: number,
    ) {
        return this.availabilityService.deleteRecurringAvailability(
            user,
            id,
        );
    }

    @Post('override')
    createCustomAvailability(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateCustomAvailabilityDto,
    ) {
        return this.availabilityService.createCustomAvailability(
            user,
            dto,
        );
    }

    @Get('date')
    getCustomAvailability(
        @CurrentUser() user: JwtPayload,
        @Query('date') date: string,
    ) {
        return this.availabilityService.getCustomAvailability(
            user,
            date,
        );
    }
}