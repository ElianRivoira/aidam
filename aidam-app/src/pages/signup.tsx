import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import Input from '@/components/form/Input';
import { postUser } from '@/services/users';
import Modal from '@/components/Modal';
import professions from '@/utils/professions';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [license, setLicense] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isEqual, setIsEqual] = useState(false);
  const [validate, setValidate] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (password && repeatPassword) {
      if (password === repeatPassword) setIsEqual(true);
      else setIsEqual(false);
    } else setValidate(false);
  }, [password, repeatPassword]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (password === repeatPassword) {
        const user = await postUser({
          firstName,
          lastName,
          email,
          phone,
          profession,
          license,
          password,
        });
        setType(1);
        setOpen(true);
      } else {
        setErrors([
          {
            message:
              'Las contraseñas deben coincidir. Por favor revise los campos "contraseña" y "repetir contraseña"',
          },
        ]);
        setType(2);
        setOpen(true);
      }
    } catch (e: any) {
      setErrors(e.response.data.errors);
      setType(2);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!open && type === 1) {
      router.push({
        pathname: '/login',
      });
    }
  }, [open]);

  return (
    <>
      <Head>
        <title>AIDAM - Registro</title>
      </Head>
      <div className='h-screen flex justify-center items-center'>
        <div className='w-full shadow-xg rounded-3xl p-3.5 pb-5 mx-5 max-w-md flex flex-col items-center'>
          <Image src={aidamTexto} alt='aidam' className='mb-8' />
          <form
            className='w-full px-4 flex flex-col items-center'
            onSubmit={handleSubmit}
          >
            <div className='flex gap-1.5'>
              <Input
                name='nombre'
                label='Nombre'
                type='text'
                onChange={e => setFirstName(e.target.value)}
                value={firstName}
              />
              <Input
                name='apellido'
                label='Apellido'
                type='text'
                onChange={e => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
            <Input
              name='email'
              label='Correo electrónico'
              type='text'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <Input
              name='phone'
              label='Teléfono'
              type='text'
              onChange={e => setPhone(e.target.value)}
              value={phone}
            />
            <div className='flex gap-1.5'>
              <Input
                name='profession'
                label='Profesión'
                type='select'
                onChangeSelect={e => setProfession(e.target.value)}
                valuesArray={professions}
              />
              <Input
                name='license'
                label='Matrícula'
                type='text'
                onChange={e => setLicense(e.target.value)}
                value={license}
              />
            </div>
            <div className='flex gap-1.5'>
              <Input
                name='password1'
                label='Contraseña'
                type='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                isEqual={isEqual}
                validate={validate}
              />
              <Input
                name='password2'
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
            <button
              type='submit'
              className='w-[165px] h-8 mt-6 rounded-md bg-aidam80 text-white font-normal text-sm hover:bg-aidam70 active:shadow-active transition-colors'
            >
              Registrarse
            </button>
            <Link
              href={'/login'}
              className='font-normal text-sm text-aidam mt-4 hover:text-aidam80 transition-colors'
            >
              ¿Ya tenés cuenta? Iniciá sesión
            </Link>
          </form>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            type={type}
            errors={errors}
          >
            <h1>Su cuenta se ha creado satisfactoriamente</h1>
            <p className='text-sm font-normal mt-1'>
              Ya puede iniciar sesión en la aplicación
            </p>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Signup;
