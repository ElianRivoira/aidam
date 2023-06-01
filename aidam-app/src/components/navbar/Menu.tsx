import Image from 'next/image';
import React from 'react';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import x from '@/assets/icons/x.svg';
import MenuOption from './MenuOption';
import profileLogo from '@/assets/icons/profileLogo.svg';
import pacientesLogo from '@/assets/icons/pacientesLogo.svg';
import logout from '@/assets/icons/logout-white.svg';
import { useQuery } from '@tanstack/react-query';
import { getLoggedUser } from '@/services/users';
import { hasCookie } from 'cookies-next';

interface MenuProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  handleLogout: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, setIsOpen, handleLogout }) => {
  const {
    isLoading,
    data: user,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['loggedUser'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  return (
    <>
      {isOpen ? (
        <button
          className='fixed w-full h-full inset-0 cursor-default bg-black/[.75] z-10'
          onClick={() => setIsOpen(false)}
        ></button>
      ) : null}
      <nav
        className={`fixed flex flex-col justify-between px-4 pt-2.5 pb-6 left-0 top-0 w-64 h-full bg-background z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className='flex justify-between items-center mb-5'>
            <Image
              src={aidamTexto}
              alt='aidam'
              width={128}
              height={40}
              quality={100}
            />
            <Image
              src={x}
              alt='aidam'
              className='h-6 w-6 cursor-pointer'
              onClick={() => setIsOpen(false)}
            />
          </div>
          <hr className='w-full border-black03' />
          <ul className='flex flex-col'>
            {user?.admin ? (
              <MenuOption href={`/admin/professionals`} logo={profileLogo} setIsOpen={setIsOpen}>
                Profesionales
              </MenuOption>
            ) : (
              <MenuOption href={`/profile/${user?._id}`} logo={profileLogo} setIsOpen={setIsOpen}>
                Mi Perfil
              </MenuOption>
            )}
            <MenuOption href='/patients' logo={pacientesLogo} setIsOpen={setIsOpen}>
              Mis Pacientes
            </MenuOption>
          </ul>
        </div>
        <div className='flex px-4 w-full justify-center'>
          <button
            className='flex bg-redLogout hover:bg-redLogout/[0.9] w-full text-white h-8 items-center justify-center rounded-[3px] text-sm'
            onClick={handleLogout}
          >
            <Image src={logout} alt='logout' className='mr-1' />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </>
  );
};

export default Menu;
