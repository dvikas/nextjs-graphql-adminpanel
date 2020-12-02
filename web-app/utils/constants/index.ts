export enum QueryParamKeys {
    PAGE = 'page',
    ORDER_BY = 'orderBy',
    DIRECTION = 'direction',
    PAGE_SIZE = 'pageSize',
}

export enum pageSizes {
    level1 = '10',
    level2 = '25',
    level3 = '50',
    level4 = '100',
}

export const defaultNumberOfTableRows = parseInt(pageSizes.level1, 10);
