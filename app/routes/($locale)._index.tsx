// app/routes/all-products.tsx
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

type SanityProduct = {
  _id: string;
  title: string;
  slug: {current: string};
  store: {
    productImage: {
      asset: {
        _id: string;
        url: string;
        altText?: string;
        width?: number;
        height?: number;
      };
    };
  };
};

export async function loader({context}: LoaderFunctionArgs) {
  const {sanityClient} = context;

  console.log({sanityClient});

  const query = `*[_type == "product"] | order(_createdAt desc){
    _id,
    "title": store.title,
    "slug": store.slug.current,
    "previewImageUrl": store.previewImageUrl,
    "priceRange": store.priceRange,
  }`;

  const products = await sanityClient.fetch<SanityProduct[]>(query);

  return products;
}

export default function AllProducts() {
  const products = useLoaderData<typeof loader>();

  if (!products.length) {
    return <p>No products found in Sanity.</p>;
  }

  console.log(products, 'products');

  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <li key={product._id} className="border p-4 rounded-md">
          {product.previewImageUrl && (
            <Image
              // Hydrogen’s Image component can also accept a `src` string
              data={{url: product.previewImageUrl}}
              alt={product.title}
              sizes="(max-width: 640px) 100vw, 25vw"
            />
          )}
          <h3 className="mt-2 font-semibold">
            <a href={`/products/${product.slug}`}>{product.title}</a>
          </h3>
        </li>
      ))}
    </ul>
  );
}
