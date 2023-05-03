import React, { useEffect } from 'react';
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { getLoggedUser } from '@/services/users';

const index = () => {
  const router = useRouter();

  const {
    isLoading,
    data: user,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['loggedUser'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  useEffect(() => {
    if (!hasCookie('session')) {
      router.push('/login');
    }
  }, []);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) {
    return <h1>{(error as any)?.response.data.errors[0].message}</h1>;
  }
  if (isSuccess) {
    if (user?.admin) router.push('/admin/professionals');
    else router.push('/patients');
  }

  return <></>;
};

export default index;
