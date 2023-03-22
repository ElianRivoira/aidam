import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import aidamLogo from '../assets/icons/aidamLogo.svg';

let name = 'AGUILERA RAMON';
let otrosTerapeutas = [
  'Bettine Decarre',
  'Nonthue Ledda',
  'Sabrina Larriba',
  'Valentina Perez',
];

const PatientCard = () => {
  return (
    <div className='flex w-full h-[168px] rounded-2xl px-3 py-2 shadow-card max-w-md'>
      <Link href={'/patients/1/profile'} className='flex w-full'>
        <div className='flex flex-col w-1/2 items-center justify-center'>
          <div>
            <Image src={aidamLogo} alt='aidam' className='w-24 h-24' />
          </div>
          <div className='font-semibold'>{name}</div>
        </div>
        <div className='flex flex-col items-center justify-center w-1/2'>
          <div className='text-center'>Otros terapeutas</div>
          <hr className='w-36 border-black03' />
          <div className='self-start text-therapists text-sm ml-4 mt-1.5'>
            {otrosTerapeutas.map(terapeuta => (
              <li>{terapeuta}</li>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PatientCard;
