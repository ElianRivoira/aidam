import Image from 'next/image';
import React, { useState } from 'react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';

import hamburMenu from '@/assets/icons/hamburMenu.svg';
import aidamLogo from '@/assets/icons/aidamLogo.svg';
import Menu from './Menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('session');
    router.push({ pathname: '/login' });
  };

  return (
    <nav className={`h-17.5 w-full ${router.asPath.includes('/patients/') ? '' : 'shadow-xm'} md:shadow-xm flex justify-between px-3`}>
      <button onClick={() => setIsOpen(true)}>
        <Image src={hamburMenu} alt='menu' />
      </button>
      <Image src={aidamLogo} alt='logo' />
      <Menu isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} />
    </nav>
  );
};

export default Navbar;
