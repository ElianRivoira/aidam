import Image from 'next/image';
import Head from 'next/head';
import { NextPageContext } from 'next';
import { useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

import Data from '@/components/profile/Data';
import profileImage from '@/assets/icons/profileImage.svg';
import professionLogo from '@/assets/icons/professionLogo.svg';
import licenseIcon from '@/assets/icons/licenseIcon.svg';
import phoneIcon from '@/assets/icons/phoneIcon.svg';
import emailIcon from '@/assets/icons/emailIcon.svg';
import cardIcon from '@/assets/icons/cardIcon.svg';
import scheduleIcon from '@/assets/icons/scheduleIcon.svg';
import Navbar from '@/components/navbar/Navbar';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import { getOnePatient } from '@/services/patients';

const Profile = ({ query }: MyPageProps) => {
  const [birthDate, setBirthDate] = useState('');

  const patient = useQuery({
    queryKey: ['patient', query.id],
    enabled: hasCookie('session'),
    queryFn: () => getOnePatient(query.id),
  });
  useEffect(() => {
    if (patient.data) {
      const date = new Date(patient.data.birth).toLocaleString().split(',')[0];
      setBirthDate(date);
    }
  }, [])

  return (
    <>
      <Head>
        <title>{`AIDAM - Perfil de ${patient.data?.name}`}</title>
      </Head>
      <div className='flex flex-col items-center'>
        <Navbar />
        <div className='w-full max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5'>
          <NavbarPatient />
          <div className='flex flex-col px-3.5'>
            <div className='self-center my-8 flex flex-col items-center'>
              <Image src={profileImage} alt='perfil' className='' />
              <p className='font-semibold text-lb'>{patient.data?.name}</p>
            </div>
            <div className='flex flex-col px-2.5 mb-4'>
              <div className='flex justify-between mb-4'>
                <p className='font-semibold'>DIAGNÓSTICO</p>
                <button className='text-xs font-normal text-white w-24 rounded-md bg-aidam80 hover:bg-aidam70'>
                  Certificado
                </button>
              </div>
              <div className='text-sm'>{patient.data?.diagnosis}</div>
            </div>
            <hr className='w-full border-black03 mb-5' />
            <div className='flex flex-col px-2.5'>
              <h1 className='font-semibold mb-6'>DATOS PERSONALES</h1>
              <Data
                icon={professionLogo}
                title={'Obra social'}
                info={patient.data?.socialwork}
              ></Data>
              <Data
                icon={licenseIcon}
                title={'N° de afiliado'}
                info={patient.data?.affiliateNumber}
              ></Data>
              <Data
                icon={cardIcon}
                title={'Módulo autorizado'}
                info={patient.data?.authorizedModule}
              ></Data>
              <Data icon={cardIcon} title={'DNI'} info={'54688688'}></Data>
              <Data
                icon={scheduleIcon}
                title={'Fecha de nacimiento'}
                info={birthDate}
              ></Data>
            </div>
            <hr className='w-full border-black03 mb-5' />
            <div className='flex flex-col px-2.5 mb-4'>
              <h1 className='font-semibold mb-6'>CONTACTO</h1>
              <Data
                icon={emailIcon}
                title={'Correo electrónico'}
                info={patient.data?.email}
              ></Data>
              <Data
                icon={phoneIcon}
                title={'Teléfono'}
                info={patient.data?.phone}
              ></Data>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

Profile.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
