import React from 'react';
import Image from 'next/image';

import profileImage from '@/assets/icons/profileImage.svg';

interface ObsProps {
  obs: Observation;
  patient: Patient;
  onClick: () => void;
}

const ObservationCard: React.FC<ObsProps> = ({ obs, patient, onClick }) => {
  let [fecha, hora] = new Date(obs.date).toLocaleString().split(',');
  let minutos;
  [hora, minutos] = hora.split(':');

  return (
    <div className='flex w-full rounded-2xl p-3 pr-5 shadow-card max-w-md mb-[26px]'>
      <button onClick={onClick} className='flex flex-col w-full'>
        <h1 className='text-lb font-semibold block text-start'>
          {obs.title}
        </h1>
        <div className='flex mt-5 items-center'>
          <Image
            src={profileImage}
            alt='foto de perfil'
            width={50}
            height={50}
          />
          <p className='ml-1.5'>{typeof obs.professional === 'object' ? `${obs.professional.firstName} ${obs.professional.lastName}` : null}</p>
        </div>
        <p className='w-full text-end text-sm'>{`${fecha}, ${hora}:${minutos} hs`}</p>
      </button>
    </div>
  );
};

export default ObservationCard;
