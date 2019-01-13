import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
    async hash(original: string, rounds: number=10) {
        const salt = await bcrypt.genSalt(rounds);
        return await bcrypt.hash(original, salt);
    }
}
