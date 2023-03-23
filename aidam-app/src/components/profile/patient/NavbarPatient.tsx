import React from 'react';
import { useRouter } from 'next/router';

const NavbarPatient = () => {
  const router = useRouter();

  return (
    <div className='w-full h-7.5 md:rounded-t-3xl flex'>
      <button className={`text-center border-black03 ${router.asPath.includes('/profile') ? 'bg-aidamNav text-white shadow-active' : 'active:shadow-active hover:bg-aidamNav hover:text-white'} md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border md:rounded-tl-3xl h-full`}>
        PERFIL
      </button>
      <button className={`text-center border-black03 ${router.asPath.includes('/reports') ? 'bg-aidamNav text-white shadow-active' : 'active:shadow-active hover:bg-aidamNav hover:text-white'} md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border h-full`}>
        INFORMES
      </button>
      <button className={`text-center border-black03 ${router.asPath.includes('/observations') ? 'bg-aidamNav text-white shadow-active' : 'active:shadow-active hover:bg-aidamNav hover:text-white'} md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border h-full`}>
        OBSERVACIONES
      </button>
      <button className={`text-center border-black03 ${router.asPath.includes('/medicsocial') ? 'bg-aidamNav text-white shadow-active' : 'active:shadow-active hover:bg-aidamNav hover:text-white'} md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border md:rounded-tr-3xl h-full`}>
        MEDICO/SOCIAL
      </button>
    </div>
  );
};

export default NavbarPatient;
