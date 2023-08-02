import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import aidamTexto from '@/assets/icons/aidamTexto.svg';
import LogoutAidam from '@/components/navbar/LogoutAidam';
import styles from '@/styles/Navbar.module.css';
import hamburMenu from '@/assets/icons/hamburMenu.svg';
import aidamLogo from '@/assets/icons/aidamLogo.svg';
import Menu from './Menu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getLoggedUser } from '@/services/users';
import Modal from '../Modal';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const regExp = /\/profile\/[a-z0-9]+/i;
  const [isOpen, setIsOpen] = useState(false);
  const [cookieError, setCookieError] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const router = useRouter();

  const user = useQuery({
    queryKey: ['loggedUser'],
    retry: 1,
    queryFn: getLoggedUser,
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

  const handleLogout = () => {
    deleteCookie('session');
    router.push({ pathname: '/login' });
  };

  useEffect(() => {
    if (type === 2 && !open && cookieError) router.push('/login');
  }, [open]);

  return (
    <>
      {useMediaQuery(1024) ? (
        <nav className={`h-17.5 w-full shadow-xm flex justify-between bg-white fixed z-20 px-3`}>
          <button onClick={() => setIsOpen(true)}>
            <Image src={hamburMenu} alt='menu' />
          </button>
          <div className='w-fit flex items-center'>
            <Image src={aidamLogo} alt='logo' className='w-10 h-10' />
          </div>
          <Menu isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} />
        </nav>
      ) : (
        <nav className={`h-20 w-full shadow-xm fixed z-20 flex justify-between bg-white`}>
          <div className='w-full flex justify-between items-center pl-14 pr-[30px]'>
            <Image src={aidamTexto} alt='logo' className='w-44 h-16' />
            <div className='w-[40%] 2xl:w-1/3 flex justify-between items-center'>
              {user.data?.admin ? (
                <Link
                  href={'/admin/professionals'}
                  className={`${styles.navbarButton} font-medium text-xb transition-colors ${
                    router.asPath.includes('/professionals') ? styles.activeSite : ''
                  }`}
                >
                  PROFESIONALES
                </Link>
              ) : (
                <Link
                  href={`/profile/${user.data?._id}`}
                  className={`${styles.navbarButton} font-medium text-xb transition-colors ${
                    regExp.test(router.asPath) ? styles.activeSite : ''
                  }`}
                >
                  MI PERFIL
                </Link>
              )}
              <Link
                href={'/patients'}
                className={`${styles.navbarButton} font-medium text-xb transition-colors ${
                  router.asPath.includes('/patients') ? styles.activeSite : ''
                }`}
              >
                PACIENTES
              </Link>
              <button
                onClick={handleLogout}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <LogoutAidam
                  width={35}
                  height={35}
                  fill={`${isHovered ? 'rgba(12, 9, 146, 0.8)' : 'black'}`}
                />
              </button>
            </div>
          </div>
          <Modal open={open} onClose={() => router.push('/login')} type={type} errors={errors}>
            <h1></h1>
          </Modal>
        </nav>
      )}
    </>
  );
};

export default Navbar;
