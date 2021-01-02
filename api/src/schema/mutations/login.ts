import { stringArg, mutationField } from '@nexus/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookieDuration } from '../../utils/constants';
import analytics from '../../utils/analytics';
import { verifyEnvironmentVariables } from '../../utils/verifyEnvironmentVariables';

export const loginMutationField = mutationField('login', {
    type: 'User',
    args: { email: stringArg({ required: true }), password: stringArg({ required: true }) },
    resolve: async (_, { email, password }, ctx) => {
        email = email.toLowerCase();
        const user = await ctx.prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        if (!user.password) {
            throw new Error(`No password set for that email. Sign in with Google instead.`);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid Password!');
        }
        verifyEnvironmentVariables(process.env.API_APP_SECRET, 'API_APP_SECRET');
        const token = jwt.sign({ userId: user.id }, process.env.API_APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: cookieDuration,
            sameSite: 'none',
            secure: true,
            // domain: process.env.API_COOKIE_DOMAIN,
        });

        analytics.track({ eventType: 'Login', userId: user.id, eventProperties: { method: 'Password' } });

        return user;
    },
});
