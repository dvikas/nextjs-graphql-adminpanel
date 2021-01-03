import { mutationField, idArg, stringArg, intArg, arg, booleanArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const createProductMutationField = mutationField('createProduct', {
    type: 'Product',
    args: {
        name: stringArg({ required: true }),
        description: stringArg({ required: true }),
        price: intArg({ required: true }),
        discount: intArg({ required: true }),
        salePrice: intArg({ required: true }),
        sku: stringArg({ required: true }),
        unit: stringArg({ required: true }),
        categoryId: idArg({ required: true }),
        images: arg({
            type: 'ProductImageCreateWithoutProductInput',
            list: true,
            required: true,
        }),
    },
    // name  description price discount salePrice sku unit category* user*
    resolve: async (_, { name, description, price, discount, salePrice, sku, unit, categoryId, images }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        if (process.env.IS_DEMO_ACCOUNT === 'true') {
            throw Error('Sorry, you can\'t do update or delete in DEMO account');
        }
        const user = await ctx.prisma.user.findOne({
            where: { id: ctx.user.id }
        });

        const newProduct = await ctx.prisma.product.create({
            data: {
                User: { connect: { id: ctx.user.id } },
                Category: { connect: { id: categoryId } },
                name,
                description,
                price,
                discount,
                salePrice,
                sku,
                unit,
                ProductImages: {
                    create: images
                }
            },
        });

        analytics.track({
            eventType: 'Product created',
            userId: ctx.user.id,
            eventProperties: {
                id: newProduct.id,
            },
        });
        return newProduct;
    },
});
