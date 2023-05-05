import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteCookie, hasCookie } from 'cookies-next';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import logout from '@/assets/icons/logout-black.svg';
import styles from '@/styles/Navbar.module.css';
import { useQuery } from '@tanstack/react-query';
import { getLoggedUser } from '@/services/users';

const NavbarDesktop = () => {
  const router = useRouter();
  const regExp = /\/profile\/[a-z0-9]+/i;

  const user = useQuery({
    queryKey: ['loggedUser'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  const handleLogout = () => {
    deleteCookie('session');
    router.push({ pathname: '/login' });
  };

  return (
    <nav className={`h-20 w-full shadow-xm flex justify-between`}>
      <div className='w-full flex justify-between items-center pl-14 pr-[30px]'>
        <Image src={aidamTexto} alt='logo' className='w-44 h-16' />
        <div className='w-[40%] 2xl:w-1/3 flex justify-between items-center'>
          {user.data?.admin ? (
            <Link href={'/admin/professionals'} className={`${styles.navbarButton} font-medium text-xb transition-colors ${router.asPath.includes('/professionals') ? styles.activeSite : ''}`}>PROFESIONALES</Link>
            ) : (
            <Link href={`/profile/${user.data?._id}`} className={`${styles.navbarButton} font-medium text-xb transition-colors ${regExp.test(router.asPath) ? styles.activeSite : ''}`}>MI PERFIL</Link>
          )}
          <Link href={'/patients'} className={`${styles.navbarButton} font-medium text-xb transition-colors ${router.asPath.includes('/patients') ? styles.activeSite : ''}`}>PACIENTES</Link>
          <button onClick={handleLogout}>
            <Image src={logout} alt='logout' width={35} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavbarDesktop