import { objectType } from '@nexus/schema';

export const Category = objectType({
    name: 'Category',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.name();
        t.model.parent();
        t.model.slug();
        t.model.updatedAt();
    },
});

export const ProductImage = objectType({
    name: 'ProductImage',
    definition(t) {
        t.model.id();
        t.model.createdAt();
        t.model.updatedAt();
        t.model.image();
        t.model.Product();
        t.model.productId();
    },
});

export const Product = objectType({
    name: 'Product',
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.price();
        t.model.salePrice();
        t.model.sku();
        t.model.unit();
        t.model.User();
        t.model.Category();
        t.model.ProductImages({ ordering: { createdAt: true } });
        t.model.description();
        t.model.discount();
        t.model.createdAt();
        t.model.updatedAt();
    },
});

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.model.email();
        t.model.name();
        t.model.role();
        t.model.status();
        t.model.hasCompletedOnboarding();
        t.model.hasVerifiedEmail();
    },
});

export const GoogleMapsLocation = objectType({
    name: 'GoogleMapsLocation',
    definition(t) {

        t.model.id();
        t.model.name();
        t.model.googlePlacesId();
    },
});
