import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import aidamTexto from '../assets/icons/aidamTexto.svg';
import Input from '@/components/form/Input';
import { login } from '@/services/users';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);
    setUser(user);
    router.push('patients');
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className='flex h-screen justify-center items-center'>
        <form
          onSubmit={handleSubmit}
          className='flex w-full flex-col items-center mx-5 shadow-xg rounded-3xl'
        >
          <div>
            <Image src={aidamTexto} alt='aidam' className='mb-6 mt-5' />
          </div>
          <div className='mx-7 mb-3'>
            <Input
              label='Correo electrónico'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
            ></Input>
            <Input
              label='Contraseña'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></Input>
          </div>
          <div className='flex flex-col'>
            <button className='text-xs text-aidam mb-3'>
              ¿Olvidaste tu contraseña?
            </button>
            <button
              type='submit'
              className='bg-aidam80 text-white w-44 h-8 rounded-md text-sm mb-3'
            >
              Iniciar Sesión
            </button>
            <button className='text-aidam text-sm mb-4'>Registrarse</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
