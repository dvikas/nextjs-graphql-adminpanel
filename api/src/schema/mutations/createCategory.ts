import { mutationField, stringArg, arg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const createCategoryMutationField = mutationField('createCategory', {
    type: 'Category',
    args: {
        name: stringArg({ required: true }),
        slug: stringArg({ required: true }),
        parent: stringArg({ required: true }),
    },
    resolve: async (_, { name, slug, parent }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        if (process.env.IS_DEMO_ACCOUNT === 'true') {
            throw Error('Sorry, you can\'t do update or delete in DEMO account');
        }
        // Then create the Category entry in Prisma, storing the S3 file info
        const createdCategory = await ctx.prisma.category.create({
            data: {
                name,
                slug,
                parent,
            },
        });
        analytics.track({
            eventType: 'Category created',
            userId: ctx.user.id,
            eventProperties: {
                id: createdCategory.id,
            },
        });
        return createdCategory;
    },
});
