import { mutationField, stringArg } from '@nexus/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import analytics from '../../utils/analytics';
import { verifyEnvironmentVariables } from '../../utils/verifyEnvironmentVariables';

export const resetPasswordMutationField = mutationField('resetPassword', {
    type: 'User',
    args: {
        password: stringArg(),
        confirmPassword: stringArg(),
        resetToken: stringArg(),
    },
    resolve: async (_, { password, confirmPassword, resetToken }, ctx) => {
        if (password !== confirmPassword) {
            throw new Error("Passwords don't match!");
        }
        const [user] = await ctx.prisma.user.findMany({
            where: {
                resetToken: resetToken,
                resetTokenExpiry: { gte: Date.now() - 3600000 },
            },
        });
        if (!user) {
            throw new Error('This token is either invalid or expired!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await ctx.prisma.user.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        verifyEnvironmentVariables(process.env.API_APP_SECRET, 'API_APP_SECRET');
        const token = jwt.sign({ userId: updatedUser.id }, process.env.API_APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
            sameSite: 'none',
            secure: true,
            // domain: process.env.API_COOKIE_DOMAIN,
        });

        analytics.track({ eventType: 'Reset password success' });

        return updatedUser;
    },
});
