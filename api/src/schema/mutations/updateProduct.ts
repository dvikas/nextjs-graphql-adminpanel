import { mutationField, idArg, stringArg, intArg, arg, booleanArg } from '@nexus/schema';
import analytics from '../../utils/analytics';
import { verifyUserIsAuthenticated } from '../../utils/verifyUserIsAuthenticated';

export const updateProductMutationField = mutationField('updateProduct', {
    type: 'Product',
    args: {
        id: idArg({ required: true }),
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
        alreadyUploadedImages: arg({
            type: 'ProductImageCreateWithoutProductInput',
            list: true,
            required: true,
        }),
    },
    // name  description price discount salePrice sku unit category* user*
    resolve: async (_, { id, name, description, price, discount, salePrice, sku, unit, categoryId, images, alreadyUploadedImages }, ctx) => {
        verifyUserIsAuthenticated(ctx.user);
        if (process.env.IS_DEMO_ACCOUNT === 'true') {
            throw Error('Sorry, you can\'t do update or delete in DEMO account');
        }
        const user = await ctx.prisma.user.findOne({
            where: { id: ctx.user.id }
        });

        const currentImages = await ctx.prisma.productImage.findMany({
            where: { productId: id },
        });

        const imageIdsToDelete = currentImages.reduce((prev: string[], curr) => {
            if (curr.id && alreadyUploadedImages.every((image) => image.id !== curr.id)) {
                prev.push(curr.id);
            }
            return prev;
        }, []);

        const imagesToCreate = images.filter((image) => currentImages.every((c) => c.id !== image.id));

        const product = await ctx.prisma.product.update({
            where: {
                id,
            },
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
                    ...(imagesToCreate.length ? { create: imagesToCreate } : {}),
                    ...(imageIdsToDelete.length
                        ? {
                            deleteMany: {
                                id: { in: imageIdsToDelete },
                            },
                        }
                        : {}),
                },
            },
        });

        analytics.track({
            eventType: 'Product updated',
            userId: ctx.user.id,
            eventProperties: {
                id: product.id,
            },
        });
        return product;
    },
});
