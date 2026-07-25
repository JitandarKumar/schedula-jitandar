import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }
    //signup
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
    // login
    async login(loginDto: LoginDto) {
        // Find user by email
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Generate JWT
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        const { password, ...userData } = user;

        return {
            message: 'Login successful.',
            access_token: accessToken,
            user: userData,
        };
    }
}