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
    <nav className={`h-17.5 w-full shadow-xm flex justify-between bg-white fixed z-20 px-3`}>
      <button onClick={() => setIsOpen(true)}>
        <Image src={hamburMenu} alt='menu' />
      </button>
      <div className='w-fit flex items-center'>
        <Image src={aidamLogo} alt='logo' className='w-10 h-10' />
      </div>
      <Menu isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} />
    </nav>
  );
};

export default Navbar;
