import Head from 'next/head';
import React, { useState } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/services/users';
import { useRouter } from 'next/router';
import Link from 'next/link';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import Input from '@/components/form/Input';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

const Recover = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendEmail.mutate(email);
  };

  const sendEmail = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  return (
    <>
      <Head>
        <title>AIDAM - Recuperar contraseña</title>
      </Head>
      <div className='flex pt-[70px] justify-center items-center'>
        <div className='w-full shadow-xg mx-5 rounded-3xl p-3.5 pb-5 max-w-md flex flex-col items-center'>
          <form onSubmit={handleSubmit} className='flex w-full px-4 flex-col items-center'>
            <div>
              <Image src={aidamTexto} alt='aidam' className='mb-8 mt-5' />
            </div>
            <div className='w-full mb-3'>
              <Input
                label='Ingresa tu correo electronico'
                type='email'
                name='email'
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className='flex flex-col mb-3'>
              <Button type='submit' text='Recuperar contraseña' />
            </div>
            <Link href={'/login'} className='text-aidam hover:text-aidam80 text-sm'>
              Volver al login
            </Link>
          </form>
          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
              router.push('/login');
            }}
            type={type}
            errors={errors}
          >
            <h1>Revisá tu casilla de mensajes</h1>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Recover;
