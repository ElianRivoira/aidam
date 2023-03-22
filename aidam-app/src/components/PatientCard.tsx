import Image from 'next/image';
import React from 'react';
import aidamLogo from '../assets/icons/aidamLogo.svg';

let name = 'MARIANA MARSALA';
let otrosTerapeutas = ['pepe', 'carlos', 'monica', 'jhon wick'];

const PatientCard = () => {
  return (
    <div className='flex w-full h-40 rounded-2xl px-3 py-2 shadow-card'>
      <div className='flex flex-col w-1/2 items-center'>
        <div>
          <Image src={aidamLogo} alt='aidam' className='w-24 h-24' />
        </div>
        <div className='font-semibold'>{name}</div>
      </div>
      <div className='flex flex-col items-center w-1/2'>
        <div className='text-center'>Otros terapeutas</div>
        <hr className='w-36' />
        <div className='self-start text-therapists text-sm ml-4 mt-1.5'>
          {otrosTerapeutas.map((terapeuta) => (
            <li>{terapeuta}</li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
