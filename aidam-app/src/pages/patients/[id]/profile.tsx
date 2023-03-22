import Image from 'next/image';
import Head from 'next/head';

import Data from '@/components/profile/Data';
import profileImage from '@/assets/icons/profileImage.svg';
import professionLogo from '@/assets/icons/professionLogo.svg';
import licenseIcon from '@/assets/icons/licenseIcon.svg';
import phoneIcon from '@/assets/icons/phoneIcon.svg';
import emailIcon from '@/assets/icons/emailIcon.svg';
import cardIcon from '@/assets/icons/cardIcon.svg';
import scheduleIcon from '@/assets/icons/scheduleIcon.svg';
import Navbar from '@/components/navbar/Navbar';

const profile = () => {
  return (
    <>
      <Head>
        <title>AIDAM - Perfil de "nombrepaciente"</title>
      </Head>
      <div className='flex flex-col items-center'>
        <Navbar />
        <div className='flex flex-col px-3.5 max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5'>
          <div className='self-center my-8'>
            <Image src={profileImage} alt='perfil' className='' />
            <p className='font-semibold text-lb'>NOMBRE</p>
          </div>
          <div className='flex flex-col px-2.5 mb-4'>
            <div className='flex justify-between mb-4'>
              <p className='font-semibold'>DIAGNÓSTICO</p>
              <button className='text-xs text-white w-24 rounded-md bg-aidam80 hover:bg-aidam70'>
                Certificado
              </button>
            </div>
            <div className='text-sm'>
              Trastorno específico del desarrollo del habla y del lenguaje
            </div>
          </div>
          <hr className='w-full border-black03 mb-5' />
          <div className='flex flex-col px-2.5'>
            <h1 className='font-semibold mb-6'>DATOS PERSONALES</h1>
            <Data
              icon={professionLogo}
              title={'Obra social'}
              info={'OSEP'}
            ></Data>
            <Data
              icon={licenseIcon}
              title={'N° de afiliado'}
              info={'3/336299232/01'}
            ></Data>
            <Data
              icon={cardIcon}
              title={'Módulo autorizado'}
              info={'54688688/2'}
            ></Data>
            <Data icon={cardIcon} title={'DNI'} info={'54688688'}></Data>
            <Data
              icon={scheduleIcon}
              title={'Fecha de nacimiento'}
              info={'22/02/2015'}
            ></Data>
          </div>
          <hr className='w-full border-black03 mb-5' />
          <div className='flex flex-col px-2.5 mb-4'>
            <h1 className='font-semibold mb-6'>CONTACTO</h1>
            <Data
              icon={emailIcon}
              title={'Correo electrónico'}
              info={'abbateluis@gmail.com'}
            ></Data>
            <Data
              icon={phoneIcon}
              title={'Teléfono'}
              info={'234-1231123'}
            ></Data>
          </div>
        </div>
      </div>
    </>
  );
};

export default profile;
