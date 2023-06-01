import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from '@/components/navbar/Navbar';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import useMediaQuery from '@/hooks/useMediaQuery';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />}
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}