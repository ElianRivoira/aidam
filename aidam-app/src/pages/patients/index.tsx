import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
import Modal from '@/components/Modal';

const patients = () => {
  const [cookieError, setCookieError] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const router = useRouter();

  const loggedUser = useQuery({
    queryKey: ['loggedUser'],
    queryFn: getLoggedUser,
    retry: 1,
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

  const searchedPatients = useQuery({
    queryKey: ['search patients'],
    enabled: hasCookie('session'),
    queryFn: () => {
      if (search.length > 0) return searchPatients(search);
      else return searchPatients('*');
    },
    // onSuccess: patients => {
    //   setPatients(patients)
    // },
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
    },
  });

  useEffect(() => {
    if (type === 2 && !open && cookieError) router.push('/login');
  }, [open]);

  return (
    <>
      <Head>
        <title>
          {loggedUser.data?.admin
            ? 'AIDAM Admin - Pacientes'
            : 'AIDAM - Pacientes'}
        </title>
      </Head>
      {useMediaQuery(1024) ? (
        <main className='bg-background'>
          <Navbar />
          <div className='mt-7 mb-10 flex justify-center'>
            <SearchBar search={search} setSearch={setSearch} searchQuery={searchedPatients} />
          </div>
          <div className='m-3.5 flex flex-col items-center'>
            {loggedUser.data?.admin
              ? // si es admin
                searchedPatients.data?.map((patient, index) => (
                  <MobileCard
                    key={index}
                    patient={patient}
                    user={loggedUser.data}
                  />
                ))
              : // si no es admin
              search.length > 0
              ? // si hay texto a buscar
                searchedPatients.data?.map(
                  (patient, index) =>
                    loggedUser.data && (
                      <MobileCard
                        key={index}
                        patient={patient}
                        user={loggedUser.data}
                      />
                    )
                )
              : // si no hay texto a buscar traigo los pacientes asignados al usuario
                loggedUser.data?.patientsId.map((patient, index) => (
                  <MobileCard
                    key={index}
                    patient={patient}
                    user={loggedUser.data}
                  />
                ))}
          </div>
        </main>
      ) : (
        <>
          <main className='min-h-screen bg-background'>
          <NavbarDesktop />
            <div className='flex justify-end mt-7 w-full'>
              <div className='w-[70%] flex justify-between items-center mr-12'>
                <SearchBar search={search} setSearch={setSearch} searchQuery={searchedPatients} />
                {loggedUser.data?.admin && (
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
              {loggedUser.data?.admin
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
                  loggedUser.data?.patientsId.map((patient, index) => (
                    <DesktopCard key={index} patient={patient} />
                  ))}
            </div>
          </main>
        </>
      )}
      <Modal
        open={open}
        onClose={() => router.push('/login')}
        type={type}
        errors={errors}
      >
        <h1></h1>
      </Modal>
    </>
  );
};

export default patients;
