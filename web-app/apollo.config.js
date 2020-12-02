module.exports = {
    client: {
        includes: ['{pages,components,graphql,utils}/**/*.{tsx,ts}'],
        localSchemaFile: 'schema.graphql',
        service: {
            localSchemaFile: '../api/src/generated/schema.graphql',
        },
    },
};
