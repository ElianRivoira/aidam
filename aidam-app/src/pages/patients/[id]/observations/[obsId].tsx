import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPageContext } from 'next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';

import Navbar from '@/components/navbar/Navbar';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import { getOnePatient } from '@/services/patients';
import {
  deleteObservation,
  getObservation,
  putObservation,
} from '@/services/observations';
import Modal from '@/components/Modal';
import ArrowBack from '@/components/ArrowBack';

interface Fecha {
  fecha: string;
  hora: string;
  minutos: string;
}

const ObservationId = ({ query }: MyPageProps) => {
  const [date, setDate] = useState<Fecha>();
  const [obsText, setObsText] = useState('');
  const [readonly, setReadonly] = useState(true);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const router = useRouter();

  const patient = useQuery({
    queryKey: ['patient', query.id],
    enabled: hasCookie('session'),
    queryFn: () => getOnePatient(query.id),
  });

  const observation = useQuery({
    queryKey: ['observation', query.obsId],
    enabled: hasCookie('session'),
    queryFn: () => getObservation(query.obsId),
  });

  const putObs = useMutation({
    mutationFn: putObservation,
    onSuccess: newobs => {
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
      setType(3);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  useEffect(() => {
    if (observation.data?.date) {
      let [fecha, hora] = new Date(observation.data.date)
        .toLocaleString()
        .split(',');
      let minutos: string;
      [hora, minutos] = hora.split(':');
      setDate({ fecha, hora, minutos });
    }
    if (observation.data?.observation) {
      setObsText(observation.data.observation);
    }
  }, [observation.data]);

  useEffect(() => {
    if (type === 3 && open === false) {
      router.push({
        pathname: `/patients/${patient.data?._id}/observations`,
      });
    }
  }, [open]);

  const handleEdit = () => {
    setReadonly(true);

    putObs.mutate({
      id: query.obsId,
      text: obsText,
    });
  };

  const handleDelete = () => {
    deleteObs.mutate({ patientId: query.id, obsId: query.obsId });
  };

  return (
    <>
      <Head>
        <title>{`AIDAM - Observación de ${patient.data?.firstName} ${patient.data?.lastName}`}</title>
      </Head>
      <main className='flex flex-col items-center min-h-screen'>
        <Navbar />
        <div className='w-full max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5'>
          <NavbarPatient />
          <div className='flex flex-col px-3.5 pb-10 items-center'>
            <div className='w-full flex flex-col pt-2'>
              <ArrowBack width={25} />
              <h1 className='w-full my-6 text-xl2 font-medium text-center'>
                {observation.data?.title}
              </h1>
              <hr className='border-black03 w-full' />
            </div>
            <div className='w-full px-2.5'>
              <div className='my-6 ml-2.5 self-start'>
                <h1 className='text-xb font-medium'>
                  {typeof observation.data?.professional === 'object'
                    ? `${observation.data.professional.firstName} ${observation.data.professional.lastName}`
                    : null}
                </h1>
                {date ? (
                  <p className='text-sm'>{`${date?.fecha}, ${date?.hora}:${date?.minutos} hs`}</p>
                ) : null}
              </div>
              <textarea
                readOnly={readonly}
                onChange={e => setObsText(e.target.value)}
                className={`flex w-full min-h-[200px] rounded-2xl p-3 shadow-card max-w-md mb-[26px] text-lb font-normal resize-none cursor-default outline-none ${
                  readonly
                    ? ''
                    : 'border border-aidam hover:border-aidam cursor-text'
                }`}
                value={obsText}
              ></textarea>
              <div className='flex gap-3 justify-end w-full'>
                {readonly ? (
                  <button
                    onClick={() => setReadonly(false)}
                    className='flex items-center text-sm font-normal text-white h-7.5 p-3 rounded-md bg-aidam80 hover:bg-aidam70'
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className='flex items-center text-sm font-normal text-white h-7.5 p-3 rounded-md bg-aidam80 hover:bg-aidam70'
                  >
                    Confirmar
                  </button>
                )}
                <button
                  onClick={() => {
                    setType(4);
                    setOpen(true);
                  }}
                  className='flex items-center text-sm font-normal text-white h-7.5 p-3 rounded-md bg-redLogout hover:bg-redLogout/[0.9]'
                >
                  Eliminar
                </button>
              </div>
            </div>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              type={type}
              deleteFunc={handleDelete}
              errors={errors}
            >
              <h1>Observación modificada satisfactoriamente</h1>
            </Modal>
          </div>
        </div>
      </main>
    </>
  );
};

export default ObservationId;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

ObservationId.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
