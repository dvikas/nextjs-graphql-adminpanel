import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import { PrismaClient } from '@prisma/client';
import { cookieDuration } from './constants';
import analytics from './analytics';

export const passportAuthentication = (passport: PassportStatic): RequestHandler => (
    req,
    res,
    next
): ReturnType<RequestHandler> => {
    const { redirectUrl } = req.query;
    const state = redirectUrl ? JSON.stringify({ redirectUrl }) : undefined;
    passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
};

const handleAuthentication = ({
    res,
    req,
    error,
    newUser,
    next,
}: {
    res: Response;
    req: Request;
    error: Parameters<VerifyCallback>[0];
    newUser: Parameters<VerifyCallback>[1];
    next: NextFunction;
}): void | { newUser: typeof newUser } => {
    let redirectUrl = process.env.COMMON_FRONTEND_URL;

    // Attempt to set the redirectUrl to the value provide by the `redirectUrl` query in
    // the initial call to /auth/google
    // try {
    //     const { state } = req.query;
    //     const redirectUrlFromState = JSON.parse(state).redirectUrl;
    //     // Make sure no one tries to redirect to a malicious URL
    //     if (/^https?:\/\/.*\.nextgraphqladmin.com(:[0-9]{4})?$/.test(redirectUrlFromState)) {
    //         redirectUrl = redirectUrlFromState;
    //     }
    // } catch { }
    if (error) {
        res.locals.errorType = 'AuthenticationError';
        return next(error);
    }
    if (process.env.API_APP_SECRET === undefined) {
        throw Error('Missing API_APP_SECRET environment variable');
    }

    const token = jwt.sign({ userId: newUser.id }, process.env.API_APP_SECRET);
    // We set the jwt as a cookie on the response
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: cookieDuration,
        sameSite: 'none',
        secure: true,
        // domain: process.env.API_COOKIE_DOMAIN,
    });
    if (redirectUrl === undefined) {
        throw Error('Invalid redirect URL');
    }
    res.redirect(redirectUrl);
    return { newUser };
};

export const authenticationStrategy = (prisma: PrismaClient): GoogleStrategy => {
    if (process.env.API_GOOGLE_CLIENT_ID === undefined) {
        throw Error('Missing API_GOOGLE_CLIENT_ID environment variable');
    }

    if (process.env.API_GOOGLE_CLIENT_SECRET === undefined) {
        throw Error('Missing API_GOOGLE_CLIENT_SECRET environment variable');
    }

    if (process.env.COMMON_BACKEND_URL === undefined) {
        throw Error('Missing COMMON_BACKEND_URL environment variable');
    }

    return new GoogleStrategy(
        {
            clientID: process.env.API_GOOGLE_CLIENT_ID,
            clientSecret: process.env.API_GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.COMMON_BACKEND_URL}/auth/google/callback`,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                // Check if user already exists
                const existingUser = await prisma.user.findOne({ where: { email: profile._json.email } });
                // If user already exists, return that user
                if (existingUser) {
                    analytics.track({
                        eventType: 'Login',
                        userId: existingUser.id,
                        eventProperties: { method: 'Google' },
                    });
                    // Attach googleId to existing user if they don't already have a googleId set on their account.
                    // The user account can also safely be set to verified if the user has logged in with oauth
                    if (!existingUser.googleId) {
                        const updatedUser = await prisma.user.update({
                            where: { email: profile._json.email },
                            data: {
                                googleId: profile.id,
                                hasVerifiedEmail: true,
                            },
                        });
                        return done(undefined, updatedUser);
                    }
                    return done(undefined, existingUser);
                }

                // If the user doesn't exist, create a new user
                const newUser = await prisma.user.create({
                    data: {
                        name: 'User',
                        googleId: profile.id,
                        email: profile._json.email,
                        hasVerifiedEmail: true,
                    },
                });

                // If there was a problem creating the new user, call done with an error
                if (!newUser) {
                    done(new Error(`Failed to create new user`));
                }

                analytics.track({
                    eventType: 'Signup',
                    userId: newUser.id,
                    eventProperties: { method: 'Google' },
                });

                // If a new user was created, call done with the new user and no error
                return done(undefined, newUser);
            } catch (e) {
                return done(e, null);
            }
        }
    );
};

export const passportAuthenticationCallback = (passport: PassportStatic): RequestHandler => (
    req,
    res,
    next
): ReturnType<RequestHandler> => {
    passport.authenticate('google', { failureRedirect: '/login' }, ((error, newUser) =>
        handleAuthentication({ error, newUser, res, req, next })) as VerifyCallback)(req, res, next);
};
