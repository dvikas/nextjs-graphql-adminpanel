import { mutationField, idArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const deleteAccountMutationField = mutationField('deleteAccount', {
    type: 'User',
    args: {
        id: idArg({ required: true }),
    },
    resolve: async (_, { id }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);

        const User = await ctx.prisma.user.findOne({
            where: { id }
        });
        if (User === null) {
            throw Error('User not found');
        }
        const deletedUser = await ctx.prisma.user.delete({ where: { id } });

        analytics.track({
            eventType: 'User deleted',
            userId: ctx.user.id,
            eventProperties: {
                id,
            },
        });

        return deletedUser;
    }
});
