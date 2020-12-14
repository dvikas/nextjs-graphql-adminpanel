import { queryType, idArg, arg, stringArg } from '@nexus/schema';
import { verifyUserIsAuthenticated } from '../utils/verifyUserIsAuthenticated';

export const Query = queryType({
    definition(t) {
        // The following aliased queries are only used in order to generate types. Their alias lines up with another query name in order
        // to define our own resolvers: https://github.com/graphql-nexus/nexus-schema-plugin-prisma/issues/381#issuecomment-575357444

        t.crud.categories({ alias: 'categories', ordering: { updatedAt: true, name: true } });

        t.crud.products({ alias: 'products', ordering: { updatedAt: true, name: true } });

        t.crud.users({ alias: 'users', ordering: { status: true, name: true } });

        t.field('me', {
            type: 'User',
            nullable: true,
            resolve: async (_root, _args, ctx) => {
                if (ctx.user === null) {
                    return null;
                }
                return ctx.user;
            },
        });

        t.connectionField('categories', {
            type: 'Category',
            additionalArgs: {
                nameQuery: stringArg(),
                parentQuery: stringArg(),
                orderBy: arg({
                    type: 'QueryCategoriesOrderByInput',
                }),
                where: arg({
                    type: 'CategoryWhereUniqueInput',
                }),
            },
            inheritAdditionalArgs: true,
            nodes(root, args, ctx, _info) {
                verifyUserIsAuthenticated(ctx.user);
                const { skip, orderBy, first, where } = args;
                return ctx.prisma.category.findMany({
                    where: { ...where, name: { contains: args.nameQuery }, parent: { contains: args.parentQuery } },
                    skip,
                    orderBy,
                    first,
                });
            },
            extendConnection(t) {
                t.int('totalCount', {
                    resolve: async (root, args, ctx) => {
                        verifyUserIsAuthenticated(ctx.user);
                        const categories = await ctx.prisma.category.findMany({

                        });
                        return categories.length;
                    },
                });
            },
        }); //categories

        t.connectionField('users', {
            type: 'User',
            additionalArgs: {
                nameQuery: stringArg(),
                orderBy: arg({
                    type: 'QueryUsersOrderByInput',
                }),
                where: arg({
                    type: 'UserWhereUniqueInput',
                }),
            },
            inheritAdditionalArgs: true,
            nodes(root, args, ctx, _info) {
                verifyUserIsAuthenticated(ctx.user);
                const { skip, orderBy, first, where } = args;
                return ctx.prisma.user.findMany({
                    where: { ...where, name: { contains: args.nameQuery } },
                    skip,
                    orderBy,
                    first,
                });
            },
            extendConnection(t) {
                t.int('totalCount', {
                    resolve: async (root, args, ctx) => {
                        verifyUserIsAuthenticated(ctx.user);
                        const users = await ctx.prisma.user.findMany({

                        });
                        return users.length;
                    },
                });
            },
        });// users

        t.connectionField('products', {
            type: 'Product',
            additionalArgs: {
                nameQuery: stringArg(),
                discountRange: stringArg(),
                orderBy: arg({
                    type: 'ProductOrderByInput',
                }),
                where: arg({
                    type: 'ProductWhereUniqueInput',
                }),
            },
            inheritAdditionalArgs: true,
            nodes(root, args, ctx, _info) {
                const { skip, orderBy, first, where } = args;
                let where1 = {}
                if (args.discountRange) {
                    const range = args.discountRange.split(',')
                    const minRange = parseInt(range[0])
                    const maxRange = parseInt(range[1])
                    where1 = { ...where, discount: { lt: maxRange, gt: minRange } }
                } else {
                    where1 = { ...where }
                }
                verifyUserIsAuthenticated(ctx.user);

                return ctx.prisma.product.findMany({
                    where: { ...where1, name: { contains: args.nameQuery } },
                    skip,
                    orderBy,
                    first,
                });
            },
            extendConnection(t) {
                t.int('totalCount', {
                    resolve: async (root, args, ctx, { variableValues }) => {
                        let where1 = {}
                        if (variableValues.discount) {
                            const range = variableValues.discount.split(',')
                            const minRange = parseInt(range[0])
                            const maxRange = parseInt(range[1])
                            where1 = { discount: { lt: maxRange, gt: minRange } }
                        }

                        verifyUserIsAuthenticated(ctx.user);
                        const allProducts = await ctx.prisma.product.findMany({
                            where: { ...where1, name: { contains: variableValues.nameQuery } },
                        });
                        return allProducts.length;
                    },
                });
            },
        });// products
    },
});
