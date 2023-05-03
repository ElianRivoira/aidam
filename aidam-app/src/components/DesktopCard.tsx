import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import profileImage from '@/assets/icons/profileImage.svg';

interface DesktopCardProps {
  user?: User;
  patient?: Patient;
  observation?: Observation;
  patientId?: string;
  onClick?: () => void;
}

const DesktopCard: React.FC<DesktopCardProps> = ({
  user,
  patient,
  observation,
  patientId,
  onClick,
}) => {
  const [lastConnectionString, setLastConnectionString] = useState('');
  const [obsDate, setObsDate] = useState('');

  useEffect(() => {
    if (!user?.lastLoginDate) {
      setLastConnectionString('No se ha conectado aún');
    } else {
      setLastConnectionString(new Date(user.lastLoginDate).toLocaleString());
    }
    if(observation) setObsDate(new Date(observation.date).toLocaleString().split(',')[0])
  }, []);

  return (
    <>
      {user ? (
        <Link
          href={`/profile/${user._id}`}
          className='flex py-5 px-7 rounded-xl border border-grey2 mb-4 hover:bg-gray-100 hover:border-grey3 transition-colors'
        >
          <div className='w-[20%]'>
            <div className='mb-4 text-sm text-grey8'>Nombre y Apellido</div>
            <div className='font-semibold'>
              {user.firstName + ' ' + user.lastName}
            </div>
          </div>
          <div className='w-[20%]'>
            <div className='mb-4 text-sm text-grey8'>Profesión</div>
            <div className='font-semibold'>{user.profession}</div>
          </div>
          <div className='w-[20%]'>
            <div className='mb-4 text-sm text-grey8'>Última conexión</div>
            <div className='font-semibold'>{lastConnectionString}</div>
          </div>
          <div className='w-[40%]'>
            <div className='mb-4 text-sm text-grey8'>Últimas Acciones</div>
            <div className='font-semibold'>
              {user.lastThreeTasks.length > 0 ? (
                user.lastThreeTasks.map((action, index) => (
                  <li key={index}>{action}</li>
                ))
              ) : (
                <p>Este usuario no ha realizado acciones</p>
              )}
            </div>
          </div>
        </Link>
      ) : patient ? (
        <Link
          href={`/patients/${patient._id}/profile`}
          className='flex py-5 px-7 rounded-xl border border-grey2 mb-4 hover:bg-gray-100 hover:border-grey3 transition-colors'
        >
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>Nombre y Apellido</div>
            <div className='font-semibold'>
              {patient.firstName + ' ' + patient.lastName}
            </div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>DNI</div>
            <div className='font-semibold'>{patient.dni}</div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>Obra Social</div>
            <div className='font-semibold'>
              {patient.socialwork.toUpperCase()}
            </div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>N° de afiliado</div>
            <div className='font-semibold'>{patient.affiliateNumber}</div>
          </div>
        </Link>
      ) : observation ? (
        <button
          onClick={onClick}
          className='flex w-3/4 py-5 pr-7 rounded-xl border border-grey2 mb-4 hover:bg-gray-100 hover:border-grey3 transition-colors'
        >
          <div className='w-1/4 flex justify-center'>
            <Image src={profileImage} alt='profile image' />
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>Nombre y Apellido</div>
            <div className='font-semibold'>
              {observation.professional.firstName}{' '}
              {observation.professional.lastName}
            </div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>Descripción</div>
            <div className='font-semibold'>{observation.title}</div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-grey8'>
              Fecha de observación
            </div>
            <div className='font-semibold'>
              {obsDate}
            </div>
          </div>
        </button>
      ) : null}
    </>
  );
};

export default DesktopCard;
