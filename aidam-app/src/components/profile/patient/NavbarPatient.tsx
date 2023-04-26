import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NavbarPatient = () => {
  const router = useRouter();
  const patientId = router.query.id;

  return (
    <div className='w-full h-7.5 flex lg:shadow-xm'>
      <Link
      href={`/patients/${patientId}/profile`}
        className={`text-center border-black03 transition-colors ${
          router.asPath.includes('/profile')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } w-1/4 text-xm lg:text-lh font-medium flex items-center justify-center border h-full`}
      >
        PERFIL
      </Link>
      <Link
      href={`/patients/${patientId}/reports`}
        className={`text-center border-black03 transition-colors ${
          router.asPath.includes('/reports')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } w-1/4 text-xm lg:text-lh font-medium flex items-center justify-center border h-full`}
      >
        INFORMES
      </Link>
      <Link
      href={`/patients/${patientId}/observations`}
        className={`text-center border-black03 transition-colors ${
          router.asPath.includes('/observations')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } w-1/4 text-xm lg:text-lh font-medium flex items-center justify-center border h-full`}
      >
        OBSERVACIONES
      </Link>
      <Link
      href={`/patients/${patientId}/medicsocial`}
        className={`text-center border-black03 transition-colors ${
          router.asPath.includes('/medicsocial')
            ? 'bg-aidamNav text-white shadow-active'
            : 'active:shadow-active hover:bg-aidamNav hover:text-white'
        } w-1/4 text-xm lg:text-lh font-medium flex items-center justify-center border h-full`}
      >
        MEDICO/SOCIAL
      </Link>
    </div>
  );
};

export default NavbarPatient;
