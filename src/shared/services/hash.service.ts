import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashService {
    /**
     * Hashes the given data
     * @param data String to hash
     * @returns Hashed string
     */
    public async hashAsync(data: string): Promise<string> {
        return await hash(data, 10);
    }

    /**
     * Compares the given data with the given hash
     * @param data String to compare
     * @param hash Hash to compare
     * @returns True if the data matches the hash, false otherwise
     */
    public async compareAsync(data: string, hash: string): Promise<boolean> {
        return await compare(data, hash);
    }
}
