import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';

import Navbar from '@/components/navbar/Navbar';
import PatientCard from '@/components/PatientCard';
import useMediaQuery from '@/hooks/useMediaQuery';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import SearchBar from '@/components/SearchBar';
import { getLoggedUser } from '@/services/users';

const patients = () => {
  const user = useQuery({
    queryKey: ['user'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  return (
    <>
      <Head>
        <title>AIDAM - Pacientes</title>
      </Head>
      {useMediaQuery(1024) ? (
        <>
          <Navbar />
          <div className='mt-7 mb-10 flex justify-center'>
            <SearchBar />
          </div>
          <div className='m-3.5 flex flex-col items-center'>
            <PatientCard />
          </div>
        </>
      ) : (
        <>
          <NavbarDesktop />
          <main className='min-h-screen'>
            <div className='flex justify-end mt-7 w-full'>
              <div className='w-[70%] flex justify-between items-center mr-12'>
                <SearchBar />
                {user.data?.admin && (
                  <Link
                    href={'/admin/patients/create'}
                    className='h-10 bg-aidam80 hover:bg-aidam70 transition-colors text-lb text-white font-semibold rounded-md p-4 flex items-center'
                  >
                    Nuevo paciente
                  </Link>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default patients;
