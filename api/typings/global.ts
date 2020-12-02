// A problem with typescript-eslint requires this to be ignored
// https://github.com/typescript-eslint/typescript-eslint/issues/1596
// https://github.com/typescript-eslint/typescript-eslint/issues/1856
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User as PrismaClientUser } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response as ExpressResponse } from 'express-serve-static-core';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export interface Request {
            userId?: string;
            prismaClientUser?: PrismaClientUser | null;
            cookie: ExpressResponse['cookie'];
        }
    }
}
