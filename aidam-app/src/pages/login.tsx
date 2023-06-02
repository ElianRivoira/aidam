import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import Input from '@/components/form/Input';
import { login } from '@/services/users';
import Modal from '@/components/Modal';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginUser.mutate({ email, password });
  };

  const loginUser = useMutation({
    mutationFn: login,
    onSuccess: user => {
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
    if (type === 1 && open === false) {
      loginUser.data?.admin
        ? router.push('/admin/professionals')
        : router.push('/patients');
    }
  }, [open]);

  return (
    <>
      <Head>
        <title>AIDAM - Iniciar Sesión</title>
      </Head>
      <main className='flex h-screen justify-center items-center'>
        <div className='w-full shadow-xg mx-5 rounded-3xl p-3.5 pb-5 max-w-md flex flex-col items-center'>
          <form
            onSubmit={handleSubmit}
            className='flex w-full px-4 flex-col items-center'
          >
            <div>
              <Image src={aidamTexto} alt='aidam' className='mb-8 mt-5' />
            </div>
            <div className='w-full mb-3'>
              <Input
                name='email'
                label='Correo electrónico'
                type='email'
                onChange={e => setEmail(e.target.value)}
                value={email}
                pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
              />
              <Input
                name='password'
                label='Contraseña'
                type='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className='flex flex-col'>
              <Link href={'/recover'} className='text-xs text-aidam hover:text-aidam80 mb-3 self-center'>
                ¿Olvidaste tu contraseña?
              </Link>
              <button
                type='submit'
                className='bg-aidam80 text-white w-44 h-8 rounded-md text-sm mb-3 transition-colors active:shadow-active hover:bg-aidam70'
              >
                Iniciar Sesión
              </button>
              <Link
                href={'/signup'}
                className='text-aidam hover:text-aidam80 text-sm mb-4 self-center'
              >
                Registrarse
              </Link>
            </div>
          </form>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            type={type}
            errors={errors}
          >
            <h1>Inicio de sesión satisfactorio</h1>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default Login;
