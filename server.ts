// @ts-ignore
// Virtual entry point for the app
// import * as remixBuild from 'virtual:remix/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from '@shopify/remix-oxygen';
import { CART_QUERY_FRAGMENT } from '~/lib/fragments';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = (p: Promise<any>) => executionContext.waitUntil(p);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({session, storefront, env, cart}),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class HydrogenSession {
  constructor(
    private sessionStorage: SessionStorage,
    private session: Session,
  ) {}

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  has(key: string) {
    return this.session.has(key);
  }

  get(key: string) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key: string, value: any) {
    this.session.flash(key, value);
  }

  unset(key: string) {
    this.session.unset(key);
  }

  set(key: string, value: any) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}

// // NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
// const CART_QUERY_FRAGMENT = `#graphql
//   fragment Money on MoneyV2 {
//     currencyCode
//     amount
//   }
//   fragment CartLine on CartLine {
//     id
//     quantity
//     attributes {
//       key
//       value
//     }
//     cost {
//       totalAmount {
//         ...Money
//       }
//       amountPerQuantity {
//         ...Money
//       }
//       compareAtAmountPerQuantity {
//         ...Money
//       }
//     }
//     merchandise {
//       ... on ProductVariant {
//         id
//         availableForSale
//         compareAtPrice {
//           ...Money
//         }
//         price {
//           ...Money
//         }
//         requiresShipping
//         title
//         image {
//           id
//           url
//           altText
//           width
//           height

//         }
//         product {
//           handle
//           title
//           id
//         }
//         selectedOptions {
//           name
//           value
//         }
//       }
//     }
//   }
//   fragment CartApiQuery on Cart {
//     id
//     checkoutUrl
//     totalQuantity
//     buyerIdentity {
//       countryCode
//       customer {
//         id
//         email
//         firstName
//         lastName
//         displayName
//       }
//       email
//       phone
//     }
//     lines(first: $numCartLines) {
//       nodes {
//         ...CartLine
//       }
//     }
//     cost {
//       subtotalAmount {
//         ...Money
//       }
//       totalAmount {
//         ...Money
//       }
//       totalDutyAmount {
//         ...Money
//       }
//       totalTaxAmount {
//         ...Money
//       }
//     }
//     note
//     attributes {
//       key
//       value
//     }
//     discountCodes {
//       code
//       applicable
//     }
//   }
// ` as const;

// export {default} from 'virtual:hydrogen/entry-server';
