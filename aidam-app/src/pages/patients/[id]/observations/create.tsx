import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Navbar from '@/components/navbar/Navbar';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import { postObservation } from '@/services/observations';
import Modal from '@/components/Modal';
import arrowLeft from '@/assets/icons/arrowLeft.svg';
import { NextPageContext } from 'next';

const Create = ({ query }: MyPageProps) => {
  const [date, setDate] = useState('');
  const queryClient = useQueryClient();
  const titleRef = useRef<HTMLInputElement>(null);
  const obsRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const router = useRouter();

  const postObs = useMutation({
    mutationFn: postObservation,
    onSuccess: newObservation => {
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    }
  });

  useEffect(() => {
    const todayDate = new Date();
    setDate(todayDate.toJSON().split('T')[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleRef.current && obsRef.current) {
      postObs.mutate({
        title: titleRef.current.value,
        date: new Date(date),
        observation: obsRef.current.value,
        patientId: query.id
      });
    }
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      router.push({
        pathname: `/patients/${query.id}/observations`
      })
    }
  }, [open])

  return (
    <>
      <Head>
        <title>AIDAM - Crear observación</title>
      </Head>
      <div className='flex flex-col items-center h-screen'>
        <Navbar />
        <div className='w-full max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5 md:mb-0'>
          <NavbarPatient />
          <div className='flex flex-col px-3.5'>
            <div className='w-full flex flex-col'>
              <button onClick={() => router.back()} className='mt-2'>
                <Image src={arrowLeft} alt='back' className='' />
              </button>
              <h1 className='self-start mb-6 mt-3 text-xl2 font-medium'>
                Nueva observación
              </h1>
              <hr className='border-black03' />
            </div>
            <form onSubmit={handleSubmit} className='my-6 flex flex-col gap-3'>
              <input
                ref={titleRef}
                type='text'
                id='title'
                name='title'
                placeholder='Título'
                className='p-1.5 font-medium border border-black02 rounded-md block outline-none focus:border-aidam hover:border-aidam80'
              />
              <input
                type='date'
                value={date}
                onChange={e => setDate(e.target.value)}
                id='title'
                name='title'
                placeholder='Título'
                className='p-1.5 font-medium border border-black02 rounded-md block outline-none focus:border-aidam hover:border-aidam80'
              />
              <textarea
                ref={obsRef}
                name='obs'
                id='obs'
                cols={30}
                rows={20}
                placeholder='Describa su observación'
                className='p-1.5 border border-black02 rounded-md resize-none outline-none focus:border-aidam hover:border-aidam80'
              ></textarea>
              <button
                type='submit'
                className='w-fit self-end text-sm font-normal text-white h-7.5 px-2.5 rounded-md bg-aidam80 hover:bg-aidam70'
              >
                Crear observación
              </button>
            </form>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              type={type}
              errors={errors}
            >
              <h1>Observación creada satisfactoriamente</h1>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

Create.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};