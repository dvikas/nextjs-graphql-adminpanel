import { mutationField, idArg, stringArg, intArg, arg, booleanArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const updateCategoryMutationField = mutationField('updateCategory', {
    type: 'Category',
    args: {
        id: idArg({ required: true }),
        name: stringArg(),
        parent: stringArg({
            required: false,
        }),
        slug: stringArg(),
    },
    resolve: async (_, { id, name, parent, slug }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        if (process.env.IS_DEMO_ACCOUNT === 'true') {
            throw Error('Sorry, you can\'t do update or delete in DEMO account');
        }
        // Then create the Category entry in Prisma, storing the S3 file info
        const updatedCategory = await ctx.prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
                parent,
                slug
            },
        });

        analytics.track({
            eventType: 'Category updated',
            userId: ctx.user.id,
            eventProperties: {
                id: id,
            },
        });

        return updatedCategory;
    },
});
