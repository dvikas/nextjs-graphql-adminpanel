import { enumType } from '@nexus/schema';

export const OrderByArg = enumType({
    name: 'OrderByArg',
    members: ['asc', 'desc'],
});
