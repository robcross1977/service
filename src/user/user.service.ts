import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './user.entity';
import { CryptoService } from '../crypto/crypto.service';
import { EmailService } from '../validation/email.service';
import { PasswordService } from '../validation/password.service';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cryptoService: CryptoService,
        private readonly emailService: EmailService,
        private readonly passwordService: PasswordService
    ) {}

    async create(user: UserDto) {
        if(!await this.userExists(user.email)) {
            this.emailService.validate(user.email);
            this.passwordService.validate(user.password);
            
            return await this.userRepository.save(
                new User(user.email, await this.cryptoService.hash(user.password, 10))
            );
        } else {
            throw new HttpException('User already exists at the email specified', HttpStatus.CONFLICT);
        } 
    }

    async userExists(email: string) {
        return (await this.getByEmail(email)).length > 0;
    }

    async getByEmail(email: string) {
        return await this.userRepository.find({
            where: [{ email: email }]
        });
    }
}