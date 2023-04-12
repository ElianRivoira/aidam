import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';
import { NextPageContext } from 'next';

import Navbar from '@/components/navbar/Navbar';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import ObservationCard from '@/components/profile/patient/ObservationCard';
import { getOnePatient } from '@/services/patients';

const Observations = ({ query }: MyPageProps) => {
  const [actualDate, setActualDate] = useState('');

  useEffect(() => {
    const dateNow = new Date();
    const monthYear = dateNow
      .toLocaleString('es-ES', {
        month: 'long',
        year: 'numeric',
      })
      .split('de');
    const stringDate = monthYear.join('/');
    setActualDate(stringDate.toUpperCase());
  }, []);

  const patient = useQuery({
    queryKey: ['patient', query.id],
    keepPreviousData: true,
    enabled: hasCookie('session'),
    queryFn: () => getOnePatient(query.id),
  });

  return (
    <>
      <Head>
        <title>{`AIDAM - Observaciones de ${patient.data?.name}`}</title>
      </Head>
      <main className='flex flex-col items-center h-screen'>
        <Navbar />
        <div className='w-full max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5'>
          <NavbarPatient />
          <div className='flex flex-col px-3.5'>
            <div className='w-full flex flex-col'>
              <h1 className='self-start mt-6 text-xl2 font-medium'>
                OBSERVACIONES
              </h1>
              <h3 className='self-end mb-2 text-sm font-medium'>
                {actualDate}
              </h3>
              <hr className='border-black03' />
            </div>
            <div className='flex flex-col'>
              <div className='flex justify-between mt-4 mb-[26px]'>
                <Link
                  href={`/patients/${query.id}/observations/create`}
                  className='flex items-center text-sm font-normal text-white h-7.5 px-2.5 rounded-md bg-aidam80 hover:bg-aidam70'
                >
                  Crear observación
                </Link>
                <Link
                  href={`/patients/${query.id}/observations/find`}
                  className='flex items-center text-sm font-normal text-white h-7.5 px-2.5 rounded-md bg-aidam80 hover:bg-aidam70'
                >
                  Buscar observaciones
                </Link>
              </div>
              {patient.data?.observationsId.map(obs => {
                const date = new Date(obs.date);
                if (date.getMonth() === new Date().getMonth()) {
                  return (
                    <ObservationCard
                      obs={obs}
                      key={obs._id}
                      patient={patient.data}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Observations;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

Observations.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
