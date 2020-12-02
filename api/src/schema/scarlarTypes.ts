// TODO: Figure out how to get the file upload types to get passed down to resolvers

import { scalarType } from '@nexus/schema';
import { GraphQLUpload } from 'graphql-upload';

// Related: https://github.com/prisma-labs/nexus/issues/113
export const Upload = scalarType({
    name: GraphQLUpload.name,
    asNexusMethod: 'upload', // We set this to be used as a method later as `t.upload()` if needed
    description: GraphQLUpload.description,
    serialize: GraphQLUpload.serialize,
    parseValue: GraphQLUpload.parseValue,
    parseLiteral: GraphQLUpload.parseLiteral,
});
