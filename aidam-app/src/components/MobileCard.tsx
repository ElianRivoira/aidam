import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import aidamLogo from '../assets/icons/aidamLogo.svg';

interface CardProps {
  patient: Patient;
  user: User;
}

const MobileCard: React.FC<CardProps> = ({ patient, user }) => {
  return (
    <div className='flex w-full min-h-[168px] rounded-2xl px-3 py-2 shadow-card max-w-md mb-4'>
      <Link href={`/patients/${patient._id}/profile`} className='flex w-full'>
        <div className='flex flex-col w-1/2 items-center justify-center'>
          <div>
            <Image src={aidamLogo} alt='aidam' className='w-24 h-24' />
          </div>
          <div className='font-semibold flex text-center'>{patient.firstName} {patient.lastName}</div>
        </div>
        <div className='flex flex-col items-center justify-center w-1/2'>
          <div className='text-center'>Otros terapeutas</div>
          <hr className='w-36 border-black03' />
          <div className='self-start flex flex-col gap-1.5 sd:ml-7 text-therapists text-sm ml-4 mt-1.5'>
            {patient.professionalsId.map((therapist, index) => {
              if(therapist._id === user._id) return null;
              if(therapist.firstName.includes(' ')){
                return (
                  <li key={index}>{therapist.firstName} {therapist.lastName}</li>
                )
              }
              else return (
                <li key={index}>{therapist.firstName} {therapist.lastName}</li>
              )
              })}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MobileCard;
