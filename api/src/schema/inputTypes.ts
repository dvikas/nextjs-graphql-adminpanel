import { inputObjectType } from '@nexus/schema';

export const ProductOrderByInput = inputObjectType({
    name: 'ProductOrderByInput',
    definition(t) {
        t.field('updatedAt', {
            type: 'OrderByArg',
        });
        t.field('price', {
            type: 'OrderByArg',
        });
        t.field('name', {
            type: 'OrderByArg',
        });
    },
});
