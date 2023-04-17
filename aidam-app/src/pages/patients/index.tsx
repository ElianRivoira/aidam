import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import PatientCard from '@/components/PatientCard';
import Head from 'next/head';

const patients = () => {
  return (
    <>
      <Head>
        <title>AIDAM - Pacientes</title>
      </Head>
      <Navbar />
      <div className='m-3.5 flex flex-col items-center'>
        <PatientCard />
      </div>
    </>
  );
};

export default patients;
