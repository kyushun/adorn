import "../styles/globals.css";

import { useScrollFixed } from "hooks/use-scroll-fixed";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ fallback?: { [key: string]: any } }>) {
  useScrollFixed();

  return (
    <SWRConfig
      value={{
        fallback: pageProps.fallback || {},
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <Head>
        <title>Adorn</title>
      </Head>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
