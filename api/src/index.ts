// Used to load .env for local development. Will not be used when app is deployed to Zeit now since Zeit does not deploy the .env file.
require('dotenv-flow').config();

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { ErrorRequestHandler } from 'express-serve-static-core';
import { GraphQLServer } from 'graphql-yoga';
import passport from 'passport';
import { RequestHandler } from 'express-serve-static-core';
import { invoices, customers } from 'stripe';
import { PrismaClient } from '@prisma/client';
import { passportAuthentication, passportAuthenticationCallback, authenticationStrategy } from './utils/auth';
import analytics from './utils/analytics';
import { schema, createContext } from './schema';
import { stripe } from './utils/stripe';

const apiAppSecret = process.env.API_APP_SECRET;
const commonFrontendUrl = process.env.COMMON_FRONTEND_URL;
const commonBackenddUrl = process.env.COMMON_BACKEND_URL;

if (apiAppSecret === undefined) {
    throw Error('Missing API_APP_SECRET environment variable');
}

if (commonFrontendUrl === undefined) {
    throw Error('Missing COMMON_FRONTEND_URL environment variable');
}

if (commonBackenddUrl === undefined) {
    throw Error('Missing COMMON_BACKEND_URL environment variable');
}

const prisma = new PrismaClient();
// Used to sure that it's truly Stripe making the API calls the the /stripe endpoint
const stripeWebhookSecret = process.env.API_STRIPE_WEBHOOK_SECRET;

if (stripeWebhookSecret === undefined) {
    throw Error('Missing API_STRIPE_WEBHOOK_SECRET environment variable');
}

const server = new GraphQLServer({
    schema,
    context: createContext,
});

const handleStripeWebhook: RequestHandler = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    if (sig === undefined) {
        throw Error('Missing stripe signature from request headers');
    }

    const event = stripe.webhooks.constructEvent(request.body, sig, stripeWebhookSecret);

    // Handle the event
    // switch (event.type) {
    // case 'invoice.payment_succeeded':
    //     // eslint-disable-next-line no-console
    //     console.log('Upgrading user to premium tier');
    //     const setIsPremiumData = event.data.object as invoices.IInvoice;
    //     if (setIsPremiumData.customer && typeof setIsPremiumData.customer === 'string') {
    //         // Make sure there is a user associated with the stripe ID, otherwise make sure to create/update the billing info
    //         // of of user with the customer ID provided by stripe. This happens when gifting people premium memberships through
    //         // the stripe UI
    //         const billingInfo = await prisma.billingInfo.findOne({
    //             where: { stripeCustomerId: setIsPremiumData.customer },
    //         });
    //         if (billingInfo === null) {
    //             await prisma.billingInfo.create({
    //                 data: {
    //                     User: { connect: { email: setIsPremiumData.customer_email } },
    //                     stripeCustomerId: setIsPremiumData.customer,
    //                 },
    //             });
    //         }
    //         await prisma.billingInfo.update({
    //             where: { stripeCustomerId: setIsPremiumData.customer },
    //             data: {
    //                 isPremiumActive: true,
    //             },
    //         });
    //         analytics.track({
    //             eventType: 'Invoice paid',
    //             eventProperties: {
    //                 stripeCustomerId: setIsPremiumData.customer,
    //             },
    //         });
    //     }
    // break;
    // case 'invoice.payment_failed':
    // case 'subscription_schedule.canceled':
    // case 'customer.subscription.deleted':
    // eslint-disable-next-line no-console
    // console.log('Downgrading user to free tier');
    // const unsetIsPremiumData = event.data.object as invoices.IInvoice;
    // if (unsetIsPremiumData.customer && typeof unsetIsPremiumData.customer === 'string') {
    //     await prisma.billingInfo.update({
    //         where: { stripeCustomerId: unsetIsPremiumData.customer },
    //         data: {
    //             isPremiumActive: false,
    //             billingFrequency: null,
    //             endOfBillingPeriod: null,
    //             startOfBillingPeriod: null,
    //             stripeSubscriptionId: null,
    //             willCancelAtEndOfPeriod: false,
    //         },
    //     });

    //     analytics.track({
    //         eventType: 'Downgrading user to free tier',
    //         eventProperties: {
    //             stripeCustomerId: unsetIsPremiumData.customer,
    //         },
    //     });
    // }
    // break;
    // case 'customer.deleted':
    //     // eslint-disable-next-line no-console
    //     console.log('Downgrading user to free tier');
    //     const unsetCustomerData = event.data.object as customers.ICustomer;
    //     if (unsetCustomerData.id) {
    //         await prisma.billingInfo.delete({ where: { stripeCustomerId: unsetCustomerData.id } });
    //     }
    //     analytics.track({
    //         eventType: 'Downgrading user to free tier',
    //         eventProperties: {
    //             stripeCustomerId: unsetCustomerData.id,
    //         },
    //     });
    //     break;
    //     default:
    //         // Unexpected event type
    //         return response.status(400).end();
    // }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};

server.express.use(cookieParser());
server.express.use(
    session({
        secret: apiAppSecret,
        resave: false,
        saveUninitialized: false,
    })
);

// Authentication
passport.use(authenticationStrategy(prisma));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

server.express.use(passport.initialize());
server.express.use(passport.session());
server.express.get('/auth/google', passportAuthentication(passport));
server.express.get('/auth/google/callback', passportAuthenticationCallback(passport));
// Stripe webhook endpoint
server.express.post('/stripe', bodyParser.raw({ type: 'application/json' }), handleStripeWebhook);

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        try {
            const { userId } = jwt.verify(token, apiAppSecret) as { userId?: string };
            // put the userId onto the req for future requests to access
            req.userId = userId;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e.message);
            // If the JWT is invalid remove the cookie in the response so the front-end redirects
            // the user to the login page
            res.clearCookie('token', {
                // domain: process.env.API_COOKIE_DOMAIN,
            });
        }
    }
    next();
});

// Express error handler
server.express.use(((err, req, res, _next) => {
    if (res.locals.errorType === 'AuthenticationError') {
        // eslint-disable-next-line no-console
        console.log('Authentication error', err);
        const queryString = `authError=true`;
        res.redirect(`${commonFrontendUrl}/login?${queryString}`);
    } else {
        // eslint-disable-next-line no-console
        console.log('Unhandled server error', err);
        res.status(400).json({ error: err });
    }
}) as ErrorRequestHandler);


const fs = require('fs')

var options = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT)
};
// Start the server
server.start(
    {
        cors: {
            credentials: true,
            origin: ['http://local.app.nextgraphqladmin.com:3000', commonFrontendUrl],
        },
        https: options,
        port: process.env.PORT || process.env.API_PORT,
    },
    // eslint-disable-next-line no-console
    () => console.log(`Server running at ${commonBackenddUrl}`)
);
