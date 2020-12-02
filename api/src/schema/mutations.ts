import { mutationType } from '@nexus/schema';

export const Mutation = mutationType({
    definition(t) {
        // The following aliased mutations are only used in order to generate types. Their alias lines up with another mutation name in order
        // to define our own resolvers: https://github.com/graphql-nexus/nexus-schema-plugin-prisma/issues/381#issuecomment-575357444
        t.crud.updateOneGoogleMapsLocation({ alias: 'updateUser' });
        t.crud.createOneGoogleMapsLocation({ alias: 'createUser' });
    },
});
