import { randomBytes } from 'crypto';
import { promisify } from 'util';

export const generateToken = async (): Promise<string> => {
    const randomBytesPromisified = promisify(randomBytes);
    return (await randomBytesPromisified(20)).toString('hex');
};
