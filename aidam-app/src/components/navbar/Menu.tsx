import Image from 'next/image';
import React from 'react';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import x from '@/assets/icons/x.svg';
import MenuOption from './MenuOption';
import perfilLogo from '@/assets/icons/perfilLogo.svg';
import pacientesLogo from '@/assets/icons/pacientesLogo.svg';
import logout from '@/assets/icons/logout.svg';

interface MenuProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  handleLogout: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, setIsOpen, handleLogout }) => {

  return (
    <>
      {isOpen ? (
        <button
          className='fixed w-full h-full inset-0 cursor-default bg-black/[.75] z-10'
          onClick={() => setIsOpen(false)}
        ></button>
      ) : null}
      <nav
        className={`fixed flex flex-col justify-between px-4 pt-2.5 pb-6 left-0 top-0 w-64 h-full bg-white z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className='flex justify-between items-center mb-5'>
            <Image src={aidamTexto} alt='aidam' className='h-10 w-32' />
            <Image
              src={x}
              alt='aidam'
              className='h-6 w-6 cursor-pointer'
              onClick={() => setIsOpen(false)}
            />
          </div>
          <hr className='w-full border-black03' />
          <ul className='flex flex-col'>
            <MenuOption href='' logo={perfilLogo}>
              Mi Perfil
            </MenuOption>
            <MenuOption href='' logo={pacientesLogo}>
              Mis Pacientes
            </MenuOption>
          </ul>
        </div>
        <div className='flex px-4 w-full justify-center'>
          <button className='flex bg-redLogout hover:bg-redLogout/[0.9] w-full text-white h-8 items-center justify-center rounded-[3px] text-sm'
            onClick={handleLogout}
          >
            <Image src={logout} alt='logout' />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </>
  );
};

export default Menu;
