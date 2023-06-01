import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useMutation, useQuery } from '@tanstack/react-query';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

// import Navbar from '@/components/navbar/Navbar';
// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import ObservationCard from '@/components/profile/patient/ObservationCard';
import { getOnePatient } from '@/services/patients';
import { formatStringDate } from '@/utils/formatDate';
import PickDateModal from '@/components/profile/patient/PickDateModal';
import useMediaQuery from '@/hooks/useMediaQuery';
import DesktopCard from '@/components/DesktopCard';
import CreateObs from '@/components/observations/CreateObs';
import { deleteObservation, putObservation, postObservation } from '@/services/observations';
import ObsModal from '@/components/observations/ObsModal';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

const Observations = ({ query }: MyPageProps) => {
  const [actualDate, setActualDate] = useState(new Date());
  const [searchDate, setSearchDate] = useState<Date>();
  const [openPickDate, setOpenPickDate] = useState(false);
  const [openCreateObs, setOpenCreateObs] = useState(false);
  const [openObs, setOpenObs] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [obsId, setObsId] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cookieError, setCookieError] = useState(false);
  const [filteredObs, setFilteredObs] = useState<Observation[]>([]);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const patient = useQuery({
    queryKey: ['patient', query.id],
    keepPreviousData: true,
    queryFn: () => getOnePatient(query.id),
    retry: 1,
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
    onSuccess: patient => {
      filterObs(actualDate, patient);
    },
  });

  const postObs = useMutation({
    mutationFn: postObservation,
    onSuccess: newObservation => {
      setSuccessMsg('Observación creada satisfactoriamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const putObs = useMutation({
    mutationFn: putObservation,
    onSuccess: newobs => {
      setSuccessMsg('Observación modificada satisfactoriamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const deleteObs = useMutation({
    mutationFn: deleteObservation,
    onSuccess: newobs => {
      setSuccessMsg('Observación eliminada correctamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  useEffect(() => {
    if (type === 1 && !open) {
      setOpenObs(false);
      setOpenCreateObs(false);
      patient.refetch();
    } else if (type === 2 && !open && cookieError) router.push('/login');
  }, [open]);

  const handleDelete = () => {
    deleteObs.mutate({ patientId: query.id, obsId });
  };

  const openDeleteModal = () => {
    setType(4);
    setOpen(true);
  };

  const handleOpenObs = (obsId: string) => {
    setObsId(obsId);
    setOpenObs(true);
  };

  useEffect(() => {
    setDateValue(actualDate.toJSON().split('T')[0]);
  }, [openCreateObs]);

  const filterObs = (searchDate: Date, patient: Patient | undefined) => {
    const filtered = patient?.observationsId.filter(obs => {
      const obsDate = new Date(obs.date);
      if (obsDate.getMonth() === searchDate.getMonth()) return true;
    });
    filtered && filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    filtered && setFilteredObs(filtered);
  };

  return (
    <>
      <Head>
        <title>{`AIDAM - Observaciones de ${patient.data?.firstName} ${patient.data?.lastName}`}</title>
      </Head>
      <main className='flex flex-col items-center min-h-screen bg-background'>
        {/* {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />} */}
        <div className='w-full lg:px-12 lg:mt-2.5'>
          <NavbarPatient />
          <div className='flex flex-col lgMax:px-3.5'>
            {!useMediaQuery(1024) ? (
              <>
                <div className='w-full flex justify-between my-5 items-center'>
                  <div className='w-1/2 flex justify-between'>
                    <h2 className='text-xg font-medium flex items-center'>
                      {patient.data?.firstName} {patient.data?.lastName}
                    </h2>
                    <h1 className='text-xl2 font-medium'>OBSERVACIONES</h1>
                  </div>
                  <div className='lg:w-[45%] xb:w-1/3 flex gap-6 justify-end'>
                    <Button onClick={() => setOpenCreateObs(true)} text='Crear observación' />
                    <Button onClick={() => setOpenPickDate(true)} text='Buscar observaciones' />
                  </div>
                </div>
                <hr className='border-black03' />
              </>
            ) : (
              <div className='w-full flex flex-col'>
                <h2 className='text-lm mt-2.5 font-medium flex items-center'>
                  {patient.data?.firstName} {patient.data?.lastName}
                </h2>
                <h1 className='self-start mt-5 text-xl2 font-medium'>OBSERVACIONES</h1>
                <h3 className='self-end mb-2 text-sm font-medium'>
                  {searchDate ? formatStringDate(searchDate) : formatStringDate(actualDate)}
                </h3>
                <hr className='border-black03' />
              </div>
            )}
            <div className='flex flex-col'>
              {useMediaQuery(1024) ? (
                <>
                  <div className='flex justify-between mt-4 mb-[26px]'>
                    <Button onClick={() => setOpenCreateObs(true)} text='Crear observación' />
                    <Button onClick={() => setOpenPickDate(true)} text='Buscar observaciones' />
                  </div>
                  <div className='w-full flex flex-col items-center'>
                    {patient.isFetching ? (
                      <Spinner />
                    ) : patient.data?.observationsId.length ? (
                      filteredObs.length ? (
                        filteredObs.map(obs => {
                          return (
                            <ObservationCard
                              onClick={() => handleOpenObs(obs._id)}
                              obs={obs}
                              key={obs._id}
                              patient={patient.data}
                            />
                          );
                        })
                      ) : (
                        <p>El paciente no posee observaciones para la fecha seleccionada</p>
                      )
                    ) : (
                      <p>El paciente no posee observaciones</p>
                    )}
                  </div>
                </>
              ) : (
                <div className='w-full flex flex-col items-center mt-4'>
                  <div className='w-3/4 mb-8 font-medium text-lm'>
                    {searchDate ? formatStringDate(searchDate) : formatStringDate(actualDate)}
                  </div>
                  {patient.isFetching ? (
                    <Spinner />
                  ) : patient.data?.observationsId.length ? (
                    filteredObs.length ? (
                      filteredObs.map(obs => {
                        return (
                          <DesktopCard
                            onClick={() => handleOpenObs(obs._id)}
                            observation={obs}
                            key={obs._id}
                            patientId={patient.data._id}
                          />
                        );
                      })
                    ) : (
                      <p>El paciente no posee observaciones para la fecha seleccionada</p>
                    )
                  ) : (
                    <p>El paciente no posee observaciones</p>
                  )}
                </div>
              )}
            </div>
            <PickDateModal
              open={openPickDate}
              onClose={() => setOpenPickDate(false)}
              date={searchDate ? searchDate : actualDate}
              onChange={filterObs}
              setDate={setSearchDate}
              patient={patient.data}
            />
            <CreateObs
              open={openCreateObs}
              onClose={() => setOpenCreateObs(false)}
              postObs={postObs}
              patient={patient.data}
              date={dateValue}
              setDate={setDateValue}
            />
            <ObsModal
              openDeleteModal={openDeleteModal}
              obsId={obsId}
              putObs={putObs}
              open={openObs}
              onClose={() => setOpenObs(false)}
            />
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              type={type}
              deleteFunc={handleDelete}
              errors={errors}
              deleteMessage={'¿Está seguro que desea eliminar la observación?'}
            >
              <h1>{successMsg}</h1>
            </Modal>
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

Observations.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
