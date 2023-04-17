import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import logout from '@/assets/icons/logout-black.svg';
import styles from '@/styles/Navbar.module.css';

const NavbarDesktop = () => {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('session');
    router.push({ pathname: '/login' });
  };

  return (
    <nav className={`h-20 w-full shadow-xm flex justify-between`}>
      <div className='w-full flex justify-between items-center pl-14 pr-[30px]'>
        <Image src={aidamTexto} alt='logo' className='w-44 h-16' />
        <div className='w-1/3 flex justify-between items-center'>
          <Link href={'/professionals'} className={`${styles.navbarButton} font-medium text-xb transition-colors ${router.asPath.includes('/professionals') ? styles.activeSite : ''}`}>PROFESIONALES</Link>
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