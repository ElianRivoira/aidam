import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import rightArrow from '@/assets/icons/rightArrow.svg';

interface MenuProps {
  children?: React.ReactNode;
  href: string;
  logo?: any;
}

const MenuOption: React.FC<MenuProps> = ({ children, href, logo }) => {
  return (
    <li className='block'>
      <Link
        href={href}
        className={`flex py-5 text-xg text-black hover:bg-aidam70 rounded`}
      >
        <div className='filter hover:invert flex justify-between w-full'>
          <div className='flex items-center'>
            {logo ? <Image src={logo} alt='logo' className='mr-2.5 ' /> : null}
            {children}
          </div>
          <Image src={rightArrow} alt='link' />
        </div>
      </Link>
    </li>
  );
};

export default MenuOption;
