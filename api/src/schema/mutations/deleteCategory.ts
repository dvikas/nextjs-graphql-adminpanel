import { Category } from './../objectTypes';
import { mutationField, idArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const deleteCategoryMutationField = mutationField('deleteCategory', {
    type: 'Category',
    args: {
        id: idArg({ required: true }),
    },
    resolve: async (_, { id }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        if (process.env.IS_DEMO_ACCOUNT === 'true') {
            throw Error('Sorry, you can\'t do update or delete in DEMO account');
        }
        const Category = await ctx.prisma.category.findOne({
            where: { id }
        });
        if (Category === null) {
            throw Error('Category not found');
        }
        const deletedCategory = await ctx.prisma.category.delete({ where: { id } });

        analytics.track({
            eventType: 'Category deleted',
            userId: ctx.user.id,
            eventProperties: {
                id,
            },
        });

        return deletedCategory;
    },
});
