import gql from 'graphql-tag';

export const GET_PRODUCTS = gql`
  query products(
    $orderBy: ProductOrderByInput = {updatedAt: desc},
    $first: Int=1,
    $skip: Int,
    $nameQuery: String,
    $discount: String
    ) {
        products(first: $first, skip: $skip, orderBy: $orderBy, nameQuery: $nameQuery, discountRange: $discount) {
          nodes {
            id
            name
            price
            discount
            salePrice
            sku
            unit
            description
            Category {
                id
                name
                parent
            }
            ProductImages{
              id
              image
            }

          }
          totalCount
        }
      }
      `;