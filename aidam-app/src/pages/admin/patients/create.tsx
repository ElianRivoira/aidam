import React, { useState } from 'react';
import Head from 'next/head';

import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import Input from '@/components/form/Input';
import ArrowBack from '@/components/ArrowBack';
import TagInput from '@/components/form/TagInput';

const create = () => {
  const [certificate, setCertificate] = useState<File | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    birth: '',
    socialWork: '',
    affiliateNumber: '',
    authorizedModule: '',
    diagnosis: '',
    email: '',
    phone: '',
    professionals: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    files && setCertificate(files[0]);
  };

  return (
    <>
      <Head>
        <title>AIDAM Admin - Nuevo paciente</title>
      </Head>
      <NavbarDesktop />
      <main className='min-h-screen px-12 bg-background'>
        <div className=' w-full mt-12'>
          <ArrowBack />
          <h1 className='text-center text-xl4 font-semibold'>NUEVO PACIENTE</h1>
          <form className='mt-20 flex flex-col'>
            <div className='flex justify-evenly'>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Nombre'
                  name='firstName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.firstName}
                />
                <Input
                  label='Nombre'
                  name='lastName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.lastName}
                />
                <Input
                  label='DNI'
                  name='dni'
                  type='tel'
                  onChange={e => handleChange(e)}
                  value={patientInfo.dni}
                />
                <Input
                  label='Fecha de Nacimiento'
                  name='birth'
                  type='date'
                  onChange={e => handleChange(e)}
                  value={patientInfo.birth}
                />
              </div>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Obra Social'
                  name='socialWork'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.socialWork}
                />
                <Input
                  label='N° de Afiliado'
                  name='affiliateNumber'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.affiliateNumber}
                />
                <Input
                  label='Módulo Autorizado'
                  name='authorizedModule'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.authorizedModule}
                />
                <Input
                  label='Diagnóstico'
                  name='diagnosis'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.diagnosis}
                />
              </div>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Correo Electrónico'
                  name='email'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.email}
                />
                <Input
                  label='N° de Teléfono'
                  name='phone'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.phone}
                />
                <Input
                  label='Certificado'
                  name='certificate'
                  type='file'
                  onChange={e => handleFile(e)}
                />
                <TagInput />
              </div>
            </div>
            <div className='flex justify-evenly mt-10'>
              <div className='w-1/4'></div>
              <div className='w-1/4'></div>
              <div className='w-1/4 flex justify-end'>
                <button type='submit' className='border  px-10 py-2 rounded-md bg-aidam80 hover:bg-aidam70 transition-colors text-white w-fit self-end'>
                  Confirmar
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default create;
