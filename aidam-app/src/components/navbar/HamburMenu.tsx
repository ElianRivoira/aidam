import Image from 'next/image';
import React from 'react';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import x from '@/assets/icons/x.svg';
import MenuOption from './MenuOption';
import perfilLogo from '@/assets/icons/perfilLogo.svg';
import pacientesLogo from '@/assets/icons/pacientesLogo.svg';

interface MenuProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

const LeftHamburgerMenu: React.FC<MenuProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen ? (
        <button
          className='fixed w-full h-full inset-0 cursor-default bg-black/[.75] z-10'
          onClick={() => setIsOpen(false)}
        ></button>
      ) : null}
      <nav
        className={`fixed px-4 pt-2.5 left-0 top-0 w-64 h-full bg-white z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex justify-between items-center mb-5'>
          <Image src={aidamTexto} alt='aidam' className='h-10 w-32' />
          <Image src={x} alt='aidam' className='h-6 w-6' />
        </div>
        <hr className='w-full border-black03' />
        <ul className='flex flex-col'>
          <MenuOption href='' logo={perfilLogo}>Mi Perfil</MenuOption>
          <MenuOption href='' logo={pacientesLogo}>Mis Pacientes</MenuOption>
        </ul>
      </nav>
    </>
  );
};

export default LeftHamburgerMenu;
