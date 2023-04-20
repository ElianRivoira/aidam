import React, { useState } from 'react';
import Image from 'next/image';

import dotsMenu from '@/assets/icons/dotsMenu.svg';

interface DotsMenuProps {
  handleDelete: () => void;
  handleEdit: () => void;
}

const DotsMenu: React.FC<DotsMenuProps> = ({ handleDelete, handleEdit }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className='relative z-10 rounded-full w-12 h-12 flex justify-center items-center hover:shadow-xm focus:shadow-xm active:shadow-xm transition-all'
      >
        <Image src={dotsMenu} alt='menu' />
      </button>
      {open && (
        <>
          <div className='bg-white flex flex-col absolute z-20 rounded-xl w-[155px] right-3 top-[55px] border border-black03 text-center p-2'>
            <button onClick={handleEdit} className='font-medium text-lm py-[9px] hover:bg-aidamNav hover:text-white cursor-pointer transition-colors rounded-md'>
              Editar
            </button>
            <button onClick={handleDelete} className='font-medium text-lm py-[9px] hover:bg-aidamNav hover:text-white cursor-pointer transition-colors rounded-md'>
              Eliminar
            </button>
          </div>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setOpen(false)}
          ></div>
        </>
      )}
    </>
  );
};

export default DotsMenu;
