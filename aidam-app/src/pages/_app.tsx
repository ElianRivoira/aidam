import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Navbar from '@/components/navbar/Navbar';
import { hasCookie } from 'cookies-next';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <div className={`pt-[70px] lg:pt-[80px] min-h-screen bg-background`}>
        <Component {...pageProps} />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
