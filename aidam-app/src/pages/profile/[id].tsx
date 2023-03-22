import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

import Navbar from '@/components/navbar/Navbar';
import Data from '@/components/profile/Data';
import profileEdit from '@/assets/icons/profileEdit.svg';
import profileImage from '@/assets/icons/profileImage.svg';
import professionLogo from '@/assets/icons/professionLogo.svg';
import licenseIcon from '@/assets/icons/licenseIcon.svg';
import emailIcon from '@/assets/icons/emailIcon.svg';
import phoneIcon from '@/assets/icons/phoneIcon.svg';
import { useQuery } from '@tanstack/react-query';
import { getLoggedUser } from '@/services/users';
import { hasCookie } from 'cookies-next';

const Profile = () => {
  const {
    isLoading,
    data: user,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['user'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });



  return (
    <>
      <Head>
        <title>AIDAM - Perfil</title>
      </Head>
      <div className='h-screen flex flex-col items-center'>
        <Navbar />
        <div className='px-3.5 w-full max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5'>
          <div className='flex justify-end mt-3'>
            <button className='font-light text-xm flex flex-col items-center'>
              <Image
                src={profileEdit}
                alt='editar perfil'
                width={25}
                height={25}
                className='-mb-3'
              />
              <br />
              Editar perfil
            </button>
          </div>
          <div className='flex flex-col items-center'>
            <Image src={profileImage} alt='imagen' className='' />
            <p className='font-semibold text-lb'>{user?.name.toUpperCase()}</p>
          </div>
          <div className='mt-12 px-2.5'>
            <h1 className='font-semibold text-lb mb-5.5'>DATOS PERSONALES</h1>
            <Data
              icon={professionLogo}
              title='Profesión'
              info={user?.profession}
            />
            <Data icon={licenseIcon} title='Matrícula' info={user?.license} />
          </div>
          <hr className='w-full border-black03' />
          <div className='mt-8 px-2.5'>
            <h1 className='font-semibold text-lb mb-5.5'>CONTACTO</h1>
            <Data
              icon={emailIcon}
              title='Correo electrónico'
              info={user?.email}
            />
            <Data icon={phoneIcon} title='Teléfono' info={user?.phone} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
