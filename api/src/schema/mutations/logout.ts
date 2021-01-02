import { mutationField } from '@nexus/schema';
import { verifyEnvironmentVariables } from '../../utils/verifyEnvironmentVariables';

export const logoutMutationField = mutationField('logout', {
    type: 'Boolean',
    resolve: (_, _args, ctx) => {
        verifyEnvironmentVariables(process.env.API_COOKIE_DOMAIN, 'API_COOKIE_DOMAIN');
        // ctx.response.clearCookie('token', {
        //     domain: process.env.API_COOKIE_DOMAIN,
        // });
        ctx.response.cookie('token', '', {
            httpOnly: true,
            maxAge: 1,
            sameSite: 'none',
            secure: true,
            // domain: process.env.API_COOKIE_DOMAIN,
        });

        return true;
    },
});
