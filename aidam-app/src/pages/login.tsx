import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import aidam from '../assets/icons/aidam.svg';
import Input from '@/components/form/Input';

const Login = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className='flex h-screen justify-center items-center'>
        <div className='flex w-full flex-col items-center mx-5 shadow-xg rounded-3xl'>
          <div>
            <Image src={aidam} alt='aidam' className='mb-6 mt-5' />
          </div>
          <div className='mx-7 mb-3'>
            <Input label='Correo electronico' type='email'></Input>
            <Input label='Contraseña' type='password'></Input>
          </div>
          <div className='flex flex-col'>
            <button className='text-xs text-aidam mb-3'>
              ¿Olvidaste tu contraseña?
            </button>
            <button className='bg-aidam80 text-white w-44 h-8 rounded-md text-sm mb-3'>
              Iniciar Sesión
            </button>
            <button className='text-aidam text-sm mb-4'>Registrase</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
