if (require.main === module) {
    // Only import the environment variables if executing this file directly: https://stackoverflow.com/a/6090287/8360496
    // The schema file gets executed directly when running the generate command: yarn generate
    // Without this check, we would be trying to load the environment variables twice and that causes warnings to be thrown in the console
    require('dotenv-flow').config();
}
import path from 'path';
import { makeSchema, connectionPlugin, intArg } from '@nexus/schema';
import { nexusPrismaPlugin } from 'nexus-prisma';
import { PrismaClient, User as PrismaClientUser } from '@prisma/client';
import { ContextParameters } from 'graphql-yoga/dist/types';
import { Response as ExpressResponse } from 'express-serve-static-core';
import { Query } from './queries';
import { Mutation } from './mutations';
import {
    Category,
    Product,
    ProductImage,

    User,

    GoogleMapsLocation,
} from './objectTypes';
import { signupMutationField } from './mutations/signup';
import { loginMutationField } from './mutations/login';
import { logoutMutationField } from './mutations/logout';
import { completeOnboardingMutationField } from './mutations/completeOnboarding';
import { requestPasswordResetMutationField } from './mutations/requestPasswordReset';
import { resetPasswordMutationField } from './mutations/resetPassword';
import { deleteAccountMutationField } from './mutations/deleteAccount';

import { ProductOrderByInput } from './inputTypes';
import { OrderByArg } from './enumTypes';

import { createCategoryMutationField } from './mutations/createCategory';

import { updateCategoryMutationField } from './mutations/updateCategory';
import { updateUserMutationField } from './mutations/updateUser';
import { deleteCategoryMutationField } from './mutations/deleteCategory';
import { createProductMutationField } from './mutations/createProduct';
import { updateProductMutationField } from './mutations/updateProduct';
import { Upload } from './scarlarTypes';

const prisma = new PrismaClient();

export type Context = {
    prisma: PrismaClient;
    user: PrismaClientUser | null;
    response: ExpressResponse;
};

export const createContext = async ({ request, response }: ContextParameters): Promise<Context> => {
    let user: PrismaClientUser | null = null;
    // If user isn't logged in, keep user as null
    if (request.userId) {
        user = await prisma.user.findOne({ where: { id: request.userId } });
    }
    request.prismaClientUser = user;

    return {
        user,
        prisma,
        response: response,
    };
};

// https://github.com/graphql-nexus/nexus-schema-plugin-prisma/blob/master/examples/blog/src/schema/index.ts
export const schema = makeSchema({
    shouldGenerateArtifacts: true,
    types: [
        // Object Types
        Category,
        Product,
        ProductImage,
        GoogleMapsLocation,
        Upload,
        User,

        // Input Types
        ProductOrderByInput,

        // Enum Types
        OrderByArg,

        // Queries
        Query,

        // Mutations
        Mutation,
        completeOnboardingMutationField,
        createCategoryMutationField,
        createProductMutationField,
        updateProductMutationField,
        deleteAccountMutationField,

        loginMutationField,
        logoutMutationField,
        requestPasswordResetMutationField,
        resetPasswordMutationField,
        signupMutationField,
        updateCategoryMutationField,
        updateUserMutationField,
        deleteCategoryMutationField,

    ],
    plugins: [
        // nexusPrismaPlugin(),
        nexusPrismaPlugin({
            // Fixes the Cannot find NexusPrisma issue
            outputs: { typegen: __dirname + '/generated/index.ts' },
        }),
        connectionPlugin({
            includeNodesField: true,
            disableBackwardPagination: true,
            additionalArgs: {
                skip: intArg(),
            },
        }),
    ],
    typegenAutoConfig: {
        contextType: 'Context.Context',
        sources: [
            {
                source: '@prisma/client',
                alias: 'prisma',
            },
            {
                source: require.resolve('.'),
                alias: 'Context',
            },
        ],
    },
    outputs: {
        schema: path.join(__dirname, '../generated/schema.graphql'),
        typegen: path.join(__dirname, '../generated/nexus.ts'),
    },
});
