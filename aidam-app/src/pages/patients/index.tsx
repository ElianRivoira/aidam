import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';

import Navbar from '@/components/navbar/Navbar';
import MobileCard from '@/components/MobileCard';
import useMediaQuery from '@/hooks/useMediaQuery';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import SearchBar from '@/components/SearchBar';
import { getLoggedUser } from '@/services/users';
import { searchPatients } from '@/services/patients';
import DesktopCard from '@/components/DesktopCard';

const patients = () => {
  const [search, setSearch] = useState('');

  const user = useQuery({
    queryKey: ['user'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  const searchedPatients = useQuery({
    queryKey: ['search patients'],
    enabled: hasCookie('session'),
    queryFn: () => {
      if (search.length > 0) return searchPatients(search);
      else return searchPatients('*');
    },
  });

  useEffect(() => {
    searchedPatients.refetch();
  }, [search]);

  return (
    <>
      <Head>
        <title>AIDAM - Pacientes</title>
      </Head>
      {useMediaQuery(1024) ? (
        <main className='bg-background'>
          <Navbar />
          <div className='mt-7 mb-10 flex justify-center'>
            <SearchBar search={search} setSearch={setSearch} />
          </div>
          <div className='m-3.5 flex flex-col items-center'>
            {user.data?.admin
              ? // si es admin
                searchedPatients.data?.map((patient, index) => (
                  <MobileCard key={index} patient={patient} />
                ))
              : // si no es admin
              search.length > 0
              ? // si hay texto a buscar
                searchedPatients.data?.map((patient, index) => (
                  <MobileCard key={index} patient={patient} />
                ))
              : // si no hay texto a buscar traigo los pacientes asignados al usuario
                user.data?.patientsId.map((patient, index) => (
                  <MobileCard key={index} patient={patient} />
                ))}
          </div>
        </main>
      ) : (
        <>
          <NavbarDesktop />
          <main className='min-h-screen bg-background'>
            <div className='flex justify-end mt-7 w-full'>
              <div className='w-[70%] flex justify-between items-center mr-12'>
                <SearchBar search={search} setSearch={setSearch} />
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
            <div className='mx-12 mt-14'>
              {user.data?.admin
                ? // si es admin
                searchedPatients.data?.map((patient, index) => (
                  <DesktopCard key={index} patient={patient} />
                ))
              : // si no es admin
              search.length > 0
              ? // si hay texto a buscar
                searchedPatients.data?.map((patient, index) => (
                  <DesktopCard key={index} patient={patient} />
                ))
              : // si no hay texto a buscar traigo los pacientes asignados al usuario
                user.data?.patientsId.map((patient, index) => (
                  <DesktopCard key={index} patient={patient} />
                ))}
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default patients;
