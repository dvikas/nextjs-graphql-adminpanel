import { User } from '@prisma/client';

export function verifyUserIsAuthenticated(user: User | null): asserts user is User {
    if (user === null) {
        throw Error('User is not authenticated');
    }
}
