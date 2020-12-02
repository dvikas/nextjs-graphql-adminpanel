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

        // Then create the Category entry in Prisma, storing the S3 file info
        const createdCategory = await ctx.prisma.category.create({
            data: {
                name,
                slug,
                parent,
            },
        });

        return createdCategory;
    },
});
