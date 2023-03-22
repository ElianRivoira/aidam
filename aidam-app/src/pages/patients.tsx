import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import PatientCard from '@/components/PatientCard';

const patients = () => {
  return (
    <>
      <Navbar />
      <div className='m-2'>
        <PatientCard></PatientCard>
      </div>
    </>
  );
};

export default patients;
