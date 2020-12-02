import { useRouter } from 'next/router';
import { QueryParamKeys, defaultNumberOfTableRows } from '../constants';
import {
    QueryCategoriesOrderByInput,
    QueryUsersOrderByInput,
    OrderByArg,
} from '../../graphql/generated/graphql-global-types';

export type TableOrderBy = QueryCategoriesOrderByInput | QueryUsersOrderByInput;

// Converts a union type to an intersectino type: https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type OrderByQueryParamKeys = keyof UnionToIntersection<TableOrderBy>;

export type PaginationQuery = {
    page: number;
    pageSize: number;
    orderBy: OrderByQueryParamKeys;
    direction: OrderByArg;
};

/**
 * Hook to be used to manage pagination related URL queries
 */
export const usePaginationQuery = ({
    page: defaultPage = 1,
    pageSize: defaultPageSize = defaultNumberOfTableRows,
    orderBy: defaultOrderBy = 'updatedAt',
    direction: defaultDirection = OrderByArg.desc,
}: Partial<PaginationQuery>): PaginationQuery & {
    setQuery: ({ page, pageSize, orderBy }: Partial<PaginationQuery>) => void;
} => {
    const router = useRouter();
    const page = parseInt(router.query[QueryParamKeys.PAGE] as string, 10) || defaultPage;
    const pageSize = parseInt(router.query[QueryParamKeys.PAGE_SIZE] as string, 10) || defaultPageSize;
    const orderBy = (router.query[QueryParamKeys.ORDER_BY] as OrderByQueryParamKeys) || defaultOrderBy;
    const direction = (router.query[QueryParamKeys.DIRECTION] as OrderByArg) || defaultDirection;

    const setQuery = (newQuery: Partial<PaginationQuery>): void => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                ...newQuery,
            },
        });
    };

    return {
        page,
        orderBy,
        direction,
        pageSize,
        setQuery,
    };
};
