import React from 'react';
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
import { getPatients } from '@/services/patients';
import DesktopCard from '@/components/DesktopCard';

const patients = () => {
  const user = useQuery({
    queryKey: ['user'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  const patients = useQuery({
    queryKey: ['patients'],
    enabled: user.data?.admin,
    queryFn: getPatients,
  });

  return (
    <>
      <Head>
        <title>AIDAM - Pacientes</title>
      </Head>
      {useMediaQuery(1024) ? (
        <main className='bg-background'>
          <Navbar />
          <div className='mt-7 mb-10 flex justify-center'>
            <SearchBar />
          </div>
          <div className='m-3.5 flex flex-col items-center'>
            {user.data?.admin
              ? user.data.patientsId.map((patient, index) => (
                  <MobileCard key={index} patient={patient} />
                ))
              : patients.data?.map((patient, index) => (
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
            <div className='mx-12 mt-14'>
              {user.data?.admin
                ? patients.data?.map((patient, index) => {
                  if(patient.active){
                    return <DesktopCard key={index} patient={patient} />
                  }
                })
                : user.data?.patientsId.map((patient, index) => {
                  if(patient.active){
                    return <DesktopCard key={index} patient={patient} />
                  }
                })}
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default patients;
