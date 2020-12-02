import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { QueryParamKeys } from '../constants';

/**
 * Hook to be used for modals that need a query to persist in the URL
 */
export const useModalQuery = (
    query: QueryParamKeys,
    id?: string
): {
    isOpen: boolean;
    onOpen: (options?: {
        queryToExclude?: QueryParamKeys;
        newlyCreatedId?: string;
        additionalQueries?: Partial<
            {
                [query in QueryParamKeys]: string;
            }
        >;
    }) => Promise<boolean>;
    onClose: (additionalQuery?: { [key: string]: string }) => Promise<boolean>;
} => {
    const router = useRouter();

    const onOpen = useCallback(
        ({
            queryToExclude,
            newlyCreatedId,
            additionalQueries = {},
        }: {
            queryToExclude?: QueryParamKeys;
            newlyCreatedId?: string;
            additionalQueries?:
                | {
                      [query in QueryParamKeys]: string;
                  }
                | {};
        } = {}): Promise<boolean> => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [queryToExclude ?? '']: excluded, ...existingQueries } = router.query;

            return router.push({
                pathname: router.pathname,
                query: {
                    ...existingQueries,
                    ...additionalQueries,
                    [query]: id ?? newlyCreatedId ?? true,
                },
            });
        },
        [id, query, router]
    );

    const onClose = useCallback(
        (additionalQuery: { [key: string]: string } = {}): Promise<boolean> => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [query]: queryToRemove, ...queryWithoutJob } = router.query;

            return router.push({
                pathname: router.pathname,
                query: {
                    ...queryWithoutJob,
                    ...additionalQuery,
                },
            });
        },
        [query, router]
    );

    return {
        isOpen: id ? router.query[query] === id : Boolean(router.query[query]),
        onOpen,
        onClose,
    };
};
