/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */


import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import fetch from 'cross-fetch';




startTransition(() => {

  const httpLink = new HttpLink({
    uri: 'http://localhost:9999/graphql', // Replace with your GraphQL endpoint
    fetch,
  });
  
  const client = new ApolloClient({
    link: httpLink, 
    cache: new InMemoryCache(),
  });
  
  hydrateRoot(
    document,
    <StrictMode>  
      <ApolloProvider client={client}>
      <RemixBrowser />
      </ApolloProvider>
    </StrictMode>
  );
});
