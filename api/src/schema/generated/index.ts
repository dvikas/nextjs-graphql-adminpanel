import * as prisma from '@prisma/client';
import { core } from '@nexus/schema';
import { GraphQLResolveInfo } from 'graphql';

// Types helpers
  type IsModelNameExistsInGraphQLTypes<
  ReturnType extends any
> = ReturnType extends core.GetGen<'objectNames'> ? true : false;

type NexusPrismaScalarOpts = {
  alias?: string;
};

type Pagination = {
  first?: boolean;
  last?: boolean;
  before?: boolean;
  after?: boolean;
  skip?: boolean;
};

type RootObjectTypes = Pick<
  core.GetGen<'rootTypes'>,
  core.GetGen<'objectNames'>
>;

/**
 * Determine if `B` is a subset (or equivalent to) of `A`.
*/
type IsSubset<A, B> = keyof A extends never
  ? false
  : B extends A
  ? true
  : false;

type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

type GetSubsetTypes<ModelName extends any> = keyof OmitByValue<
  {
    [P in keyof RootObjectTypes]: ModelName extends keyof ModelTypes
      ? IsSubset<RootObjectTypes[P], ModelTypes[ModelName]> extends true
        ? RootObjectTypes[P]
        : never
      : never;
  },
  never
>;

type SubsetTypes<ModelName extends any> = GetSubsetTypes<
  ModelName
> extends never
  ? `ERROR: No subset types are available. Please make sure that one of your GraphQL type is a subset of your t.model('<ModelName>')`
  : GetSubsetTypes<ModelName>;

type DynamicRequiredType<ReturnType extends any> = IsModelNameExistsInGraphQLTypes<
  ReturnType
> extends true
  ? { type?: SubsetTypes<ReturnType> }
  : { type: SubsetTypes<ReturnType> };

type GetNexusPrismaInput<
  ModelName extends any,
  MethodName extends any,
  InputName extends 'filtering' | 'ordering'
> = ModelName extends keyof NexusPrismaInputs
  ? MethodName extends keyof NexusPrismaInputs[ModelName]
    ? NexusPrismaInputs[ModelName][MethodName][InputName]
    : never
  : never;

/**
 *  Represents arguments required by Prisma Client JS that will
 *  be derived from a request's input (args, context, and info)
 *  and omitted from the GraphQL API. The object itself maps the
 *  names of these args to a function that takes an object representing
 *  the request's input and returns the value to pass to the prisma
 *  arg of the same name.
 */
export type LocalComputedInputs<MethodName extends any> = Record<
  string,
  (params: LocalMutationResolverParams<MethodName>) => unknown
>

export type GlobalComputedInputs = Record<
  string,
  (params: GlobalMutationResolverParams) => unknown
>

type BaseMutationResolverParams = {
  info: GraphQLResolveInfo
  ctx: Context
}

export type GlobalMutationResolverParams = BaseMutationResolverParams & {
  args: Record<string, any> & { data: unknown }
}

export type LocalMutationResolverParams<
  MethodName extends any
> = BaseMutationResolverParams & {
  args: MethodName extends keyof core.GetGen2<'argTypes', 'Mutation'>
    ? core.GetGen3<'argTypes', 'Mutation', MethodName>
    : any
}

export type Context = core.GetGen<'context'>

type NexusPrismaRelationOpts<
  ModelName extends any,
  MethodName extends any,
  ReturnType extends any
> = GetNexusPrismaInput<
  // If GetNexusPrismaInput returns never, it means there are no filtering/ordering args for it.
  ModelName,
  MethodName,
  'filtering'
> extends never
  ? {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
    } & DynamicRequiredType<ReturnType>
  : {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
      filtering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'filtering'>,
              boolean
            >
          >;
      ordering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'ordering'>,
              boolean
            >
          >;
      pagination?: boolean | Pagination;
    } & DynamicRequiredType<ReturnType>;

type IsScalar<TypeName extends any> = TypeName extends core.GetGen<'scalarNames'>
  ? true
  : false;

type IsObject<Name extends any> = Name extends core.GetGen<'objectNames'>
  ? true
  : false

type IsEnum<Name extends any> = Name extends core.GetGen<'enumNames'>
  ? true
  : false

type IsInputObject<Name extends any> = Name extends core.GetGen<'inputNames'>
  ? true
  : false

/**
 * The kind that a GraphQL type may be.
 */
type Kind = 'Enum' | 'Object' | 'Scalar' | 'InputObject'

/**
 * Helper to safely reference a Kind type. For example instead of the following
 * which would admit a typo:
 *
 * ```ts
 * type Foo = Bar extends 'scalar' ? ...
 * ```
 *
 * You can do this which guarantees a correct reference:
 *
 * ```ts
 * type Foo = Bar extends AKind<'Scalar'> ? ...
 * ```
 *
 */
type AKind<T extends Kind> = T

type GetKind<Name extends any> = IsEnum<Name> extends true
  ? 'Enum'
  : IsScalar<Name> extends true
  ? 'Scalar'
  : IsObject<Name> extends true
  ? 'Object'
  : IsInputObject<Name> extends true
  ? 'InputObject'
  // FIXME should be `never`, but GQL objects named differently
  // than backing type fall into this branch
  : 'Object'

type NexusPrismaFields<ModelName extends keyof NexusPrismaTypes> = {
  [MethodName in keyof NexusPrismaTypes[ModelName]]: NexusPrismaMethod<
    ModelName,
    MethodName,
    GetKind<NexusPrismaTypes[ModelName][MethodName]> // Is the return type a scalar?
  >;
};

type NexusPrismaMethod<
  ModelName extends keyof NexusPrismaTypes,
  MethodName extends keyof NexusPrismaTypes[ModelName],
  ThisKind extends Kind,
  ReturnType extends any = NexusPrismaTypes[ModelName][MethodName]
> =
  ThisKind extends AKind<'Enum'>
  ? () => NexusPrismaFields<ModelName>
  : ThisKind extends AKind<'Scalar'>
  ? (opts?: NexusPrismaScalarOpts) => NexusPrismaFields<ModelName> // Return optional scalar opts
  : IsModelNameExistsInGraphQLTypes<ReturnType> extends true // If model name has a mapped graphql types
  ? (
      opts?: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName> // Then make opts optional
  : (
      opts: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName>; // Else force use input the related graphql type -> { type: '...' }

type GetNexusPrismaMethod<
  TypeName extends string
> = TypeName extends keyof NexusPrismaMethods
  ? NexusPrismaMethods[TypeName]
  : <CustomTypeName extends keyof ModelTypes>(
      typeName: CustomTypeName
    ) => NexusPrismaMethods[CustomTypeName];

type GetNexusPrisma<
  TypeName extends string,
  ModelOrCrud extends 'model' | 'crud'
> = ModelOrCrud extends 'model'
  ? TypeName extends 'Mutation'
    ? never
    : TypeName extends 'Query'
    ? never
    : GetNexusPrismaMethod<TypeName>
  : ModelOrCrud extends 'crud'
  ? TypeName extends 'Mutation'
    ? GetNexusPrismaMethod<TypeName>
    : TypeName extends 'Query'
    ? GetNexusPrismaMethod<TypeName>
    : never
  : never;
  

// Generated
interface ModelTypes {
  Card: prisma.Card
  GoogleMapsLocation: prisma.GoogleMapsLocation
  OrderDetail: prisma.OrderDetail
  Product: prisma.Product
  ProductImage: prisma.ProductImage
  User: prisma.User
  CartItem: prisma.CartItem
  Category: prisma.Category
}
  
interface NexusPrismaInputs {
  Query: {
    cards: {
  filtering: 'brand' | 'expMonth' | 'expYear' | 'id' | 'last4Digits' | 'stripePaymentMethodId' | 'AND' | 'OR' | 'NOT'
  ordering: 'brand' | 'expMonth' | 'expYear' | 'id' | 'last4Digits' | 'stripePaymentMethodId'
}
    googleMapsLocations: {
  filtering: 'googlePlacesId' | 'id' | 'name' | 'OrderDetail' | 'AND' | 'OR' | 'NOT'
  ordering: 'googlePlacesId' | 'id' | 'name'
}
    orderDetails: {
  filtering: 'id' | 'googleMapsLocationId' | 'userId' | 'AND' | 'OR' | 'NOT' | 'User' | 'GoogleMapsLocation'
  ordering: 'id' | 'googleMapsLocationId' | 'User' | 'userId' | 'GoogleMapsLocation'
}
    products: {
  filtering: 'category' | 'createdAt' | 'description' | 'discount' | 'id' | 'name' | 'price' | 'salePrice' | 'sku' | 'unit' | 'updatedAt' | 'user' | 'CartItem' | 'ProductImages' | 'AND' | 'OR' | 'NOT' | 'Category' | 'User'
  ordering: 'category' | 'createdAt' | 'description' | 'discount' | 'id' | 'name' | 'price' | 'salePrice' | 'sku' | 'unit' | 'updatedAt' | 'user' | 'Category' | 'User'
}
    productImages: {
  filtering: 'createdAt' | 'id' | 'image' | 'productId' | 'updatedAt' | 'AND' | 'OR' | 'NOT' | 'Product'
  ordering: 'createdAt' | 'id' | 'image' | 'productId' | 'updatedAt' | 'Product'
}
    users: {
  filtering: 'name' | 'email' | 'emailConfirmationToken' | 'googleId' | 'hasCompletedOnboarding' | 'hasVerifiedEmail' | 'id' | 'password' | 'resetToken' | 'resetTokenExpiry' | 'role' | 'status' | 'billing' | 'CartItem' | 'Product' | 'OrderDetail' | 'AND' | 'OR' | 'NOT'
  ordering: 'name' | 'email' | 'emailConfirmationToken' | 'googleId' | 'hasCompletedOnboarding' | 'hasVerifiedEmail' | 'id' | 'password' | 'resetToken' | 'resetTokenExpiry' | 'role' | 'status' | 'billing'
}
    cartItems: {
  filtering: 'id' | 'item' | 'quantity' | 'user' | 'productId' | 'AND' | 'OR' | 'NOT' | 'User' | 'Product'
  ordering: 'id' | 'item' | 'quantity' | 'user' | 'User' | 'Product' | 'productId'
}
    categories: {
  filtering: 'createdAt' | 'id' | 'name' | 'parent' | 'slug' | 'updatedAt' | 'Product' | 'AND' | 'OR' | 'NOT'
  ordering: 'createdAt' | 'id' | 'name' | 'parent' | 'slug' | 'updatedAt'
}

  },
    Card: {


  },  GoogleMapsLocation: {
    OrderDetail: {
  filtering: 'id' | 'googleMapsLocationId' | 'userId' | 'AND' | 'OR' | 'NOT' | 'User' | 'GoogleMapsLocation'
  ordering: 'id' | 'googleMapsLocationId' | 'User' | 'userId' | 'GoogleMapsLocation'
}

  },  OrderDetail: {


  },  Product: {
    CartItem: {
  filtering: 'id' | 'item' | 'quantity' | 'user' | 'productId' | 'AND' | 'OR' | 'NOT' | 'User' | 'Product'
  ordering: 'id' | 'item' | 'quantity' | 'user' | 'User' | 'Product' | 'productId'
}
    ProductImages: {
  filtering: 'createdAt' | 'id' | 'image' | 'productId' | 'updatedAt' | 'AND' | 'OR' | 'NOT' | 'Product'
  ordering: 'createdAt' | 'id' | 'image' | 'productId' | 'updatedAt' | 'Product'
}

  },  ProductImage: {


  },  User: {
    CartItem: {
  filtering: 'id' | 'item' | 'quantity' | 'user' | 'productId' | 'AND' | 'OR' | 'NOT' | 'User' | 'Product'
  ordering: 'id' | 'item' | 'quantity' | 'user' | 'User' | 'Product' | 'productId'
}
    Product: {
  filtering: 'category' | 'createdAt' | 'description' | 'discount' | 'id' | 'name' | 'price' | 'salePrice' | 'sku' | 'unit' | 'updatedAt' | 'user' | 'CartItem' | 'ProductImages' | 'AND' | 'OR' | 'NOT' | 'Category' | 'User'
  ordering: 'category' | 'createdAt' | 'description' | 'discount' | 'id' | 'name' | 'price' | 'salePrice' | 'sku' | 'unit' | 'updatedAt' | 'user' | 'Category' | 'User'
}
    OrderDetail: {
  filtering: 'id' | 'googleMapsLocationId' | 'userId' | 'AND' | 'OR' | 'NOT' | 'User' | 'GoogleMapsLocation'
  ordering: 'id' | 'googleMapsLocationId' | 'User' | 'userId' | 'GoogleMapsLocation'
}

  },  CartItem: {


  },  Category: {
    Product: {
  filtering: 'category' | 'createdAt' | 'description' | 'discount' | 'id' | 'name' | 'price' | 'salePrice' | 'sku' | 'unit' | 'updatedAt' | 'user' | 'CartItem' | 'ProductImages' | 'AND' | 'OR' | 'NOT' | 'Category' | 'User'
  ordering: 'category' | 'createdAt' | 'description' | 'discount' | 'id' | 'name' | 'price' | 'salePrice' | 'sku' | 'unit' | 'updatedAt' | 'user' | 'Category' | 'User'
}

  }
}

interface NexusPrismaTypes {
  Query: {
    card: 'Card'
    cards: 'Card'
    googleMapsLocation: 'GoogleMapsLocation'
    googleMapsLocations: 'GoogleMapsLocation'
    orderDetail: 'OrderDetail'
    orderDetails: 'OrderDetail'
    product: 'Product'
    products: 'Product'
    productImage: 'ProductImage'
    productImages: 'ProductImage'
    user: 'User'
    users: 'User'
    cartItem: 'CartItem'
    cartItems: 'CartItem'
    category: 'Category'
    categories: 'Category'

  },
  Mutation: {
    createOneCard: 'Card'
    updateOneCard: 'Card'
    updateManyCard: 'BatchPayload'
    deleteOneCard: 'Card'
    deleteManyCard: 'BatchPayload'
    upsertOneCard: 'Card'
    createOneGoogleMapsLocation: 'GoogleMapsLocation'
    updateOneGoogleMapsLocation: 'GoogleMapsLocation'
    updateManyGoogleMapsLocation: 'BatchPayload'
    deleteOneGoogleMapsLocation: 'GoogleMapsLocation'
    deleteManyGoogleMapsLocation: 'BatchPayload'
    upsertOneGoogleMapsLocation: 'GoogleMapsLocation'
    createOneOrderDetail: 'OrderDetail'
    updateOneOrderDetail: 'OrderDetail'
    updateManyOrderDetail: 'BatchPayload'
    deleteOneOrderDetail: 'OrderDetail'
    deleteManyOrderDetail: 'BatchPayload'
    upsertOneOrderDetail: 'OrderDetail'
    createOneProduct: 'Product'
    updateOneProduct: 'Product'
    updateManyProduct: 'BatchPayload'
    deleteOneProduct: 'Product'
    deleteManyProduct: 'BatchPayload'
    upsertOneProduct: 'Product'
    createOneProductImage: 'ProductImage'
    updateOneProductImage: 'ProductImage'
    updateManyProductImage: 'BatchPayload'
    deleteOneProductImage: 'ProductImage'
    deleteManyProductImage: 'BatchPayload'
    upsertOneProductImage: 'ProductImage'
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'BatchPayload'
    deleteOneUser: 'User'
    deleteManyUser: 'BatchPayload'
    upsertOneUser: 'User'
    createOneCartItem: 'CartItem'
    updateOneCartItem: 'CartItem'
    updateManyCartItem: 'BatchPayload'
    deleteOneCartItem: 'CartItem'
    deleteManyCartItem: 'BatchPayload'
    upsertOneCartItem: 'CartItem'
    createOneCategory: 'Category'
    updateOneCategory: 'Category'
    updateManyCategory: 'BatchPayload'
    deleteOneCategory: 'Category'
    deleteManyCategory: 'BatchPayload'
    upsertOneCategory: 'Category'

  },
  Card: {
    brand: 'String'
    expMonth: 'Int'
    expYear: 'Int'
    id: 'String'
    last4Digits: 'String'
    stripePaymentMethodId: 'String'

},  GoogleMapsLocation: {
    googlePlacesId: 'String'
    id: 'String'
    name: 'String'
    OrderDetail: 'OrderDetail'

},  OrderDetail: {
    id: 'String'
    googleMapsLocationId: 'String'
    User: 'User'
    userId: 'String'
    GoogleMapsLocation: 'GoogleMapsLocation'

},  Product: {
    category: 'String'
    createdAt: 'DateTime'
    description: 'String'
    discount: 'Int'
    id: 'String'
    name: 'String'
    price: 'Int'
    salePrice: 'Int'
    sku: 'String'
    unit: 'String'
    updatedAt: 'DateTime'
    user: 'String'
    Category: 'Category'
    User: 'User'
    CartItem: 'CartItem'
    ProductImages: 'ProductImage'

},  ProductImage: {
    createdAt: 'DateTime'
    id: 'String'
    image: 'String'
    productId: 'String'
    updatedAt: 'DateTime'
    Product: 'Product'

},  User: {
    name: 'String'
    email: 'String'
    emailConfirmationToken: 'String'
    googleId: 'String'
    hasCompletedOnboarding: 'Boolean'
    hasVerifiedEmail: 'Boolean'
    id: 'String'
    password: 'String'
    resetToken: 'String'
    resetTokenExpiry: 'Float'
    role: 'User_role'
    status: 'User_status'
    billing: 'String'
    CartItem: 'CartItem'
    Product: 'Product'
    OrderDetail: 'OrderDetail'

},  CartItem: {
    id: 'String'
    item: 'String'
    quantity: 'Int'
    user: 'String'
    User: 'User'
    Product: 'Product'
    productId: 'String'

},  Category: {
    createdAt: 'DateTime'
    id: 'String'
    name: 'String'
    parent: 'String'
    slug: 'String'
    updatedAt: 'DateTime'
    Product: 'Product'

}
}

interface NexusPrismaMethods {
  Card: NexusPrismaFields<'Card'>
  GoogleMapsLocation: NexusPrismaFields<'GoogleMapsLocation'>
  OrderDetail: NexusPrismaFields<'OrderDetail'>
  Product: NexusPrismaFields<'Product'>
  ProductImage: NexusPrismaFields<'ProductImage'>
  User: NexusPrismaFields<'User'>
  CartItem: NexusPrismaFields<'CartItem'>
  Category: NexusPrismaFields<'Category'>
  Query: NexusPrismaFields<'Query'>
  Mutation: NexusPrismaFields<'Mutation'>
}
  

declare global {
  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = GetNexusPrisma<TypeName, ModelOrCrud>;
}
  