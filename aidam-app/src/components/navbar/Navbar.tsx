import Image from 'next/image';
import React, { useState } from 'react';

import hamburMenu from '@/assets/icons/hamburMenu.svg';
import aidamLogo from '@/assets/icons/aidamLogo.svg';
import HamburMenu from './HamburMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='h-17.5 w-full shadow-xm flex justify-between px-3'>
      <button onClick={() => setIsOpen(true)}>
        <Image src={hamburMenu} alt='menu' />
      </button>
      <Image src={aidamLogo} alt='logo' />
      <HamburMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  );
};

export default Navbar;
