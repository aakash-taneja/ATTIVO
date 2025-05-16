import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/components.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ATTIVO Sports Platform</title>
        <meta name="description" content="Energize Your Game, Reward Your Stats, Elevate Your Life!" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Orbitron:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
} 