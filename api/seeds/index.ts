if (require.main === module) {
    // Only import the environment variables if executing this file directly: https://stackoverflow.com/a/6090287/8360496
    // The schema file gets executed directly when running the generate command: yarn generate
    // Without this check, we would be trying to load the environment variables twice and that causes warnings to be thrown in the console
    require('dotenv-flow').config();
}

import cuid from 'cuid';
import bcrypt from 'bcrypt';
import faker from 'faker';
import knex from 'knex';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';
import {
    PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();

const knexInstance = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'secret',
        database: 'next_graphql_admin@local',
    },
});

const userEmail = `admin@example.com`;
const userPassword = 'admin';

// eslint-disable-next-line no-console
console.log(`Creating user '${userEmail}' with password '${userPassword}'`);

async function main(): Promise<void> {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const userCuid = cuid();


    // Create user
    await prisma.user.create({
        data: {
            email: userEmail,
            password: hashedPassword,
            id: userCuid,
            hasVerifiedEmail: true,
            name: 'Vikas Dwivedi',
            role: 'ADMIN'
        },
    });
    // eslint-disable-next-line no-console
    console.log(`Seeded user: ${userEmail}`);

    process.exit(0);
}

// eslint-disable-next-line no-console
main().catch((e) => console.error(e));
