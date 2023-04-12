import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NavbarPatient = () => {
  const router = useRouter();
  const patientId = router.query.id;

  return (
    <div className='w-full h-7.5 md:rounded-t-3xl flex'>
      <Link
      href={`/patients/${patientId}/profile`}
        className={`text-center border-black03 ${
          router.asPath.includes('/profile')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border md:rounded-tl-3xl h-full`}
      >
        PERFIL
      </Link>
      <Link
      href={`/patients/${patientId}/reports`}
        className={`text-center border-black03 ${
          router.asPath.includes('/reports')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border h-full`}
      >
        INFORMES
      </Link>
      <Link
      href={`/patients/${patientId}/observations`}
        className={`text-center border-black03 ${
          router.asPath.includes('/observations')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border h-full`}
      >
        OBSERVACIONES
      </Link>
      <Link
      href={`/patients/${patientId}/medicsocial`}
        className={`text-center border-black03 ${
          router.asPath.includes('/medicsocial')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } md:border-[#e5e7eb] w-1/4 text-ls font-medium flex items-center justify-center border md:rounded-tr-3xl h-full`}
      >
        MEDICO/SOCIAL
      </Link>
    </div>
  );
};

export default NavbarPatient;
