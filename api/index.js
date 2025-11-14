import { IncomingMessage, ServerResponse } from 'http';

// Import the Hydrogen server handler
const serverModule = await import('../dist/server/index.js');
const handler = serverModule.default;

export default async function(req, res) {
  // Convert Node.js req/res to Fetch API Request/Response
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
  });

  // Create mock env and context
  const env = {
    SESSION_SECRET: process.env.SESSION_SECRET,
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN,
    PRIVATE_STOREFRONT_API_TOKEN: process.env.PRIVATE_STOREFRONT_API_TOKEN,
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID,
    SHOP_ID: process.env.SHOP_ID,
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
  };

  const executionContext = {
    waitUntil: (promise) => promise,
  };

  try {
    const response = await handler.fetch(request, env, executionContext);
    
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    if (response.body) {
      res.end(await response.text());
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
