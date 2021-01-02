import { stringArg, mutationField } from '@nexus/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/generateToken';
import { cookieDuration } from '../../utils/constants';
import analytics from '../../utils/analytics';
import { verifyEnvironmentVariables } from '../../utils/verifyEnvironmentVariables';

export const signupMutationField = mutationField('signup', {
    type: 'User',
    args: {
        name: stringArg(),
        email: stringArg(),
        password: stringArg(),
        confirmPassword: stringArg(),
    },
    resolve: async (_, { name, email, password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            throw new Error("Passwords don't match!");
        }
        email = email?.toLowerCase();
        if (email === null || email === undefined) {
            throw Error('Email is not defined');
        }
        // Check if user already exists with that email
        const existingUser = await ctx.prisma.user.findOne({ where: { email } });
        if (existingUser) {
            if (existingUser.googleId) {
                throw new Error(`User with that email already exists. Sign in with Google.`);
            }
            throw new Error(`User with that email already exists.`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const emailConfirmationToken = await generateToken();

        const user = await ctx.prisma.user.create({
            data: {
                name: 'test',
                email,
                password: hashedPassword,
                emailConfirmationToken,
            },
        });

        verifyEnvironmentVariables(process.env.API_APP_SECRET, 'API_APP_SECRET');
        const token = jwt.sign({ userId: user.id }, process.env.API_APP_SECRET);

        // NOTE: Need to specify domain in order for front-end to see cookie: https://github.com/apollographql/apollo-client/issues/4193#issuecomment-573195699
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: cookieDuration,
            sameSite: 'none',
            secure: true,
            // domain: process.env.API_COOKIE_DOMAIN,
        });

        analytics.track({ eventType: 'Signup', userId: user.id, eventProperties: { method: 'Password' } });

        return user;
    },
});
