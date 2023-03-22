import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import PatientCard from '@/components/PatientCard';

const patients = () => {
  return (
    <>
      <Navbar />
      <div className='m-3.5 flex flex-col items-center'>
        <PatientCard />
      </div>
    </>
  );
};

export default patients;
