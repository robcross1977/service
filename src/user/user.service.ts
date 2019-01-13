import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './user.entity';
import { CryptoService } from 'src/crypto/crypto.service';
import { UserInterface } from './user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cryptoService: CryptoService
    ) {}

    async create(user: UserInterface) {
        // to do: validate email format
        // to do: validate password requirements       

        return this.userRepository.save({
            email: user.email,
            password: await this.cryptoService.hash(user.password, 10)
        });
    }
}
