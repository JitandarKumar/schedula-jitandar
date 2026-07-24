import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    async signup(createUserDto: CreateUserDto) {
        // Check if email already exists
        const existingUser = await this.usersService.findByEmail(
            createUserDto.email,
        );

        if (existingUser) {
            throw new ConflictException(
                'Email is already registered.',
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            10,
        );

        createUserDto.password = hashedPassword;

        // Save user
        const user = await this.usersService.create(createUserDto);

        // Remove password before sending response
        const { password, ...result } = user;

        return {
            message: 'User registered successfully.',
            user: result,
        };
    }
}