import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { mutationField, stringArg } from '@nexus/schema';
// import { sendEmail } from '../../utils/mail';
import analytics from '../../utils/analytics';
const { transport, makeANiceEmail } = require('../../mail');

export const requestPasswordResetMutationField = mutationField('requestPasswordReset', {
    type: 'Boolean',
    args: {
        email: stringArg(),
    },
    resolve: async (_, { email }, ctx) => {
        const user = await ctx.prisma.user.findOne({ where: { email } });
        if (!user) {
            throw new Error(`No user found for ${email}`);
        }

        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        await ctx.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });

        // 3. Email them that reset token
        const mailRes = await transport.sendMail({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Your Password Reset Token',
            html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env.COMMON_FRONTEND_URL}/reset-password?resetToken=${resetToken}">Click Here to Reset</a>`),
        });

        //     await sendEmail({
        //         subject: 'Your password reset token',
        //         toAddress: [user.email],
        //         text: `Your Password Reset Token is here!
        //   \n\n
        //   <a href="${process.env.COMMON_FRONTEND_URL}/reset-password?resetToken=${resetToken}">Click Here to Reset</a>`,
        //     });

        analytics.track({ eventType: 'Reset password request' });

        return true;
    },
});
