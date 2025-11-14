// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
  createCustomerAccountClient,
} from '@shopify/hydrogen';
import { installGlobals } from '@remix-run/node';
import express from 'express';

import {AppSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

// Polyfill Web APIs for Node.js
installGlobals();

// Create Express app
const app = express();

// Middleware - serve static files
app.use(express.static('dist/client', { maxAge: '1 year' }));

/**
 * Create a middleware that handles Hydrogen requests
 */
app.all('*', async (request, res) => {
  try {
    // Get environment variables from process.env (set by Vercel)
    const env = {
      SESSION_SECRET: process.env.SESSION_SECRET,
      PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN,
      PRIVATE_STOREFRONT_API_TOKEN: process.env.PRIVATE_STOREFRONT_API_TOKEN,
      PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID,
      PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      SHOP_ID: process.env.SHOP_ID,
    };

    if (!env.SESSION_SECRET) {
      throw new Error('SESSION_SECRET environment variable is not set');
    }

    // Create a mock ExecutionContext for Oxygen API compatibility
    const executionContext = {
      waitUntil: () => Promise.resolve(),
    };

    const [cache, session] = await Promise.all([
      // Use Node.js cache API if available, otherwise create a simple cache
      Promise.resolve(new Map()),
      AppSession.init(request, [env.SESSION_SECRET]),
    ]);

    const {storefront} = createStorefrontClient({
      cache,
      waitUntil: executionContext.waitUntil,
      i18n: getLocaleFromRequest(request),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontId: env.PUBLIC_STOREFRONT_ID,
      storefrontHeaders: getStorefrontHeaders(request),
    });

    const customerAccount = createCustomerAccountClient({
      waitUntil: executionContext.waitUntil,
      request,
      session,
      customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      shopId: env.SHOP_ID,
    });

    const cart = createCartHandler({
      storefront,
      customerAccount,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });

    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV || 'production',
      getLoadContext: () => ({
        session,
        waitUntil: executionContext.waitUntil,
        storefront,
        customerAccount,
        cart,
        env,
      }),
    });

    const response = await handleRequest(request);

    if (session.isPending) {
      response.headers.set('Set-Cookie', await session.commit());
    }

    if (response.status === 404) {
      return storefrontRedirect({request, response, storefront});
    }

    // Convert Remix Response to Express response
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.status(response.status);
    
    if (response.body) {
      res.send(await response.text());
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An unexpected error occurred');
  }
});

export default app;
