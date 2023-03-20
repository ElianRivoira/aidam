import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import aidamTexto from '../assets/icons/aidamTexto.svg';
import Input from '../components/form/Input';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [license, setLicense] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isEqual, setIsEqual] = useState(false);
  const [validate, setValidate] = useState(false);

  useEffect(() => {
    if (password && repeatPassword) {
      if (password === repeatPassword) setIsEqual(true);
      else setIsEqual(false);
    } else setValidate(false);
  }, [password, repeatPassword]);

  return (
    <>
      <Head>
        <title>Registro</title>
      </Head>
      <div className='h-screen flex justify-center items-center'>
        <div className='w-full mx-5 shadow-xg rounded-3xl p-3.5 pb-5 max-w-md flex flex-col items-center'>
          <Image src={aidamTexto} alt='aidam' className='mb-8' />
          <form className='w-full px-4 flex flex-col items-center'>
            <Input
              label='Nombre y Apellido'
              type='text'
              onChange={e => setName(e.target.value)}
              value={name}
            />
            <Input
              label='Correo electrónico'
              type='text'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <Input
              label='Profesión'
              type='select'
              onChange={e => setProfession(e.target.value)}
              value={profession}
            />
            <Input
              label='Matrícula'
              type='text'
              onChange={e => setLicense(e.target.value)}
              value={license}
            />
            <div className='flex gap-1.5'>
              <Input
                label='Contraseña'
                type='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                isEqual={isEqual}
                validate={validate}
              />
              <Input
                label='Repetir contraseña'
                type='password'
                onChange={e => {
                  setRepeatPassword(e.target.value);
                  if (!repeatPassword) setValidate(true);
                }}
                value={repeatPassword}
                isEqual={isEqual}
                validate={validate}
              />
            </div>
            <button className='w-[165px] h-8 mt-6 rounded-md bg-aidam80 text-white font-normal text-sm hover:bg-aidam70 active:shadow-active'>
              Registrarse
            </button>
            <button className='font-normal text-sm text-aidam mt-4 hover:text-aidam70'>
              ¿Ya tenés cuenta? Iniciá sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
