import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import profileImage from '@/assets/icons/profileImage.svg';

interface ObsProps {
  obs: Observation;
  patient: Patient;
}

const ObservationCard: React.FC<ObsProps> = ({ obs, patient }) => {
  let [fecha, hora] = new Date(obs.date).toLocaleString().split(',');
  let minutos;
  [hora, minutos] = hora.split(':');

  return (
    <div className='flex w-full rounded-2xl p-3 pr-5 shadow-card max-w-md mb-[26px]'>
      <Link href={`/patients/${patient._id}/observations/${obs._id}`} className='flex flex-col w-full'>
        <h1 className='text-lb font-semibold block'>
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
        <p className='text-end text-sm'>{`${fecha}, ${hora}:${minutos} hs`}</p>
      </Link>
    </div>
  );
};

export default ObservationCard;
