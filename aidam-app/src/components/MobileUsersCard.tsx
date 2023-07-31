import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface CardProps {
  user: User;
}

const MobileUsersCard: React.FC<CardProps> = ({ user }) => {
  const [lastConnectionString, setLastConnectionString] = useState('');

  useEffect(() => {
    if (!user?.lastLoginDate) {
      setLastConnectionString('No se ha conectado aún');
    } else {
      setLastConnectionString(new Date(user.lastLoginDate).toLocaleString('es-ES'));
    }
  }, []);
  return (
    <Link
      href={`/profile/${user._id}`}
      className='flex flex-col w-full rounded-2xl px-3 py-2 shadow-card max-w-md mb-4'
    >
      <div className='flex mt-2 mb-1 '>
        <div className='w-1/2'>
          <div className='text-xs text-grey8 font-medium'>
            Apellido y Nombre
          </div>
          <div className='text-sm'>
            {user.lastName + ' ' + user.firstName}
          </div>
        </div>
        <div className='w-1/2'>
          <div className='text-xs text-grey8 font-medium'>Profesión</div>
          <div className='text-sm'>{user.profession}</div>
        </div>
      </div>
      <div className='mb-1'>
        <div className='text-xs text-grey8 font-medium'>Última conexión</div>
        <div className='text-sm'>{lastConnectionString}</div>
      </div>
      <div className='mb-1'>
        <div className='text-xs text-grey8 font-medium'>Última Acción</div>
        <div className='font-semibold text-sm'>
          {user.lastThreeTasks.length > 0 ? (
            <p>{user.lastThreeTasks[user.lastThreeTasks.length - 1]}</p>
          ) : (
            <p>Este usuario no ha realizado acciones</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MobileUsersCard;
