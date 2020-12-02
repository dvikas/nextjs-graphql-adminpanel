import { mutationField, idArg, stringArg, intArg, arg, booleanArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const updateUserMutationField = mutationField('updateUser', {
    type: 'User',
    args: {
        id: idArg({ required: true }),
        role: stringArg(),
        name: stringArg(),
        status: stringArg(),
    },
    resolve: async (_, { id, name, role, status }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);

        // Then create the User entry in Prisma, storing the S3 file info
        const updatedUser = await ctx.prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                role,
                status
            },
        });

        analytics.track({
            eventType: 'User updated',
            userId: ctx.user.id,
            eventProperties: {
                id: id,
            },
        });

        return updatedUser;
    },
});
