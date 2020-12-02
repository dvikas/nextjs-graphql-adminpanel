import gql from 'graphql-tag';
import { ApolloCache } from 'apollo-cache';
import { Resolvers } from 'apollo-client'
import { SNACKBAR_STATE_QUERY } from '../graphql/queries';

export const typeDefs = gql`
  extend type Query {
    isLeftDrawerOpen: Boolean!,
    snackMsg : String,
    snackType : String,
    snackBarOpen: Boolean
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Launch: ResolverMap;
  Mutation: ResolverMap;
}

export const resolvers: AppResolvers = {
  Launch: {
  },
  Mutation: {
    updateNetworkStatus: (_, { isConnected }, { cache }) => {
      cache.writeData({ data: { isConnected } });
      return null;
    },
    toggleSnackBar(_, variables, { cache }) {
      const cacheData = cache.readQuery<any>({
        query: SNACKBAR_STATE_QUERY
      })

      const data = {
        data: {
          ...cacheData,
          snackBarOpen: variables.msg !== '' ? !cacheData.snackBarOpen : false,
          snackMsg: variables.msg,
          snackType: variables.type
        }
      }
      cache.writeData(data);
      return data;
    }
  },
};
