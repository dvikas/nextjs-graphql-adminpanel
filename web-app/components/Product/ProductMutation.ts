import gql from 'graphql-tag';
export const CREATE_PRODUCT = gql`
  mutation createProduct(
    $name: String!
    $description: String!
    $price: Int!
    $discount: Int!
    $salePrice: Int!
    $sku: String!
    $unit: String!
    $categoryId: ID!
    $images: [ProductImageCreateWithoutProductInput!]!

  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      discount: $discount
      salePrice: $salePrice
      sku: $sku
      unit: $unit
      categoryId: $categoryId
      images: $images
    ) {
      id
      name
      description
      price
      discount
      salePrice
      sku
      unit
      Category {
        name
        parent
      }
      ProductImages {
        image
      }
    }
  }
`;