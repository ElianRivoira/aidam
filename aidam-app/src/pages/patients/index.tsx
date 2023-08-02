import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';

import MobileCard from '@/components/MobileCard';
import useMediaQuery from '@/hooks/useMediaQuery';
import SearchBar from '@/components/SearchBar';
import { getLoggedUser } from '@/services/users';
import { searchPatients } from '@/services/patients';
import DesktopCard from '@/components/DesktopCard';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';

const patients = () => {
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  const lastPatientRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();
  const [patientLengthVariation, setPatientLengthVariation] = useState(0);

  const loggedUser = useQuery({
    queryKey: ['loggedUser'],
    queryFn: getLoggedUser,
    enabled: hasCookie('session'),
    refetchOnWindowFocus: false,
  });

  const getPatients = async (
    search: string,
    optionalPageNumber?: number,
    resetPatients?: boolean
  ) => {
    try {
      setIsLoading(true);

      resetPatients && setPageNumber(0);

      const { findedPatients, hasMore } = await searchPatients(
        search ? search : '*',
        optionalPageNumber ? optionalPageNumber : resetPatients ? 0 : pageNumber
      );

      setHasMore(hasMore);

      if (resetPatients)
        setPatients(prevPatients => {
          setPatientLengthVariation(prevPatients.length - findedPatients.length);
          return findedPatients;
        });
      else {
        setPatients(prevPatients => {
          setPatientLengthVariation(findedPatients.length);
          return [...prevPatients, ...findedPatients];
        });
      }
      console.log(
        'patients page: ',
        optionalPageNumber ? optionalPageNumber : resetPatients ? 0 : pageNumber
      );

      setIsLoading(false);
    } catch (error) {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
    }
  };

  useEffect(() => {
    const func = async () => {
      await getPatients('*', 0, true);
      setIsLoading(false);
    };
    func();
  }, []);

  const setObserver = (node: any) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(async entries => {
      if (entries[0].isIntersecting) {
        console.log('VISIBLE');
        if (!hasMore) return;
        else {
          await getPatients(search, pageNumber + 1);
          setPageNumber(prevState => {
            console.log('pageNumber actualizado', prevState, ' + ', 1);
            return prevState + 1;
          });
        }
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    console.log('ref en index', lastPatientRef.current);
    setObserver(lastPatientRef.current);
  }, [pageNumber, lastPatientRef, patientLengthVariation]);

  return (
    <>
      <Head>
        <title>{loggedUser.data?.admin ? 'AIDAM Admin - Pacientes' : 'AIDAM - Pacientes'}</title>
      </Head>
      {useMediaQuery(1024) ? (
        <main className='bg-background pt-[30px]'>
          {/* <Navbar /> */}
          <div className='mb-10 flex w-full justify-between items-center gap-3 px-3.5'>
            <SearchBar
              search={search}
              setSearch={setSearch}
              getPatients={getPatients}
              width={loggedUser.data?.admin ? '' : 'w-full'}
              setObserver={setObserver}
              lastPatientRef={lastPatientRef.current}
              pageNumber={pageNumber}
            />
            {loggedUser.data?.admin ? (
              <div className='w-1/3 flex justify-center'>
                <Link
                  href={'/admin/patients/create'}
                  className='h-10 bg-aidam80 hover:bg-aidam70 transition-colors text-lm lgMax:text-sm lgMax:font-normal text-white font-medium rounded-md flex px-2 text-center justify-center w-fit items-center'
                >
                  Nuevo paciente
                </Link>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className='m-3.5 flex flex-col items-center'>
            {loggedUser.data?.admin
              ? // si es admin
                patients.map((patient, index) => {
                  if (patients.length === index + 1) {
                    return (
                      <MobileCard
                        key={index}
                        reference={lastPatientRef}
                        patient={patient}
                        user={loggedUser.data}
                      />
                    );
                  } else {
                    return <MobileCard key={index} patient={patient} user={loggedUser.data} />;
                  }
                })
              : // si no es admin
              search.length > 0
              ? // si hay texto a buscar
                patients.map((patient, index) => {
                  if (loggedUser.data) {
                    if (patients.length === index + 1) {
                      return (
                        <MobileCard
                          key={index}
                          reference={lastPatientRef}
                          patient={patient}
                          user={loggedUser.data}
                        />
                      );
                    } else {
                      return <MobileCard key={index} patient={patient} user={loggedUser.data} />;
                    }
                  } else return <></>;
                })
              : // si no hay texto a buscar traigo los pacientes asignados al usuario
                loggedUser.data?.patientsId.map((patient, index) => (
                  <MobileCard key={index} patient={patient} user={loggedUser.data} />
                ))}
            {isLoading ? <Spinner /> : <></>}
          </div>
        </main>
      ) : (
        <>
          <main className='pt-[30px] bg-background'>
            <div className='flex justify-end w-full'>
              <div className='w-[70%] flex justify-between items-center mr-12'>
                <SearchBar
                  search={search}
                  setSearch={setSearch}
                  getPatients={getPatients}
                  setObserver={setObserver}
                  lastPatientRef={lastPatientRef.current}
                  pageNumber={pageNumber}
                />
                {loggedUser.data?.admin ? (
                  <Link
                    href={'/admin/patients/create'}
                    className='h-10 bg-aidam80 hover:bg-aidam70 transition-colors text-lb text-white font-semibold rounded-md p-4 flex items-center w-fit'
                  >
                    Nuevo paciente
                  </Link>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className='mx-12 mt-14'>
              {loggedUser.data?.admin
                ? // si es admin
                  patients.map((patient, index) => {
                    if (patients.length === index + 1) {
                      return (
                        <DesktopCard key={index} reference={lastPatientRef} patient={patient} />
                      );
                    } else {
                      return <DesktopCard key={index} patient={patient} />;
                    }
                  })
                : // si no es admin
                search.length > 0
                ? // si hay texto a buscar
                  patients.map((patient, index) => {
                    if (patients.length === index + 1) {
                      return (
                        <DesktopCard key={index} reference={lastPatientRef} patient={patient} />
                      );
                    } else {
                      return <DesktopCard key={index} patient={patient} />;
                    }
                  })
                : // si no hay texto a buscar traigo los pacientes asignados al usuario
                  loggedUser.data?.patientsId.map((patient, index) => (
                    <DesktopCard key={index} patient={patient} />
                  ))}
              {isLoading ? <Spinner /> : <></>}
            </div>
          </main>
        </>
      )}
      <Modal open={open} onClose={() => router.push('/login')} type={type} errors={errors}>
        <h1></h1>
      </Modal>
    </>
  );
};

export default patients;
