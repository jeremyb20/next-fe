'use client';

import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from 'src/query/query-client';

type Props = React.PropsWithChildren;

const QueryProvider = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {/* {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        ) : null} */}
  </QueryClientProvider>
);

export default QueryProvider;
