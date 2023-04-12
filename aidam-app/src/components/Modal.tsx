import Image from 'next/image';
import React from 'react';

import wrongCheckbox from '../assets/icons/wrongCheckbox.svg';
import rightCheckbox from '../assets/icons/rightCheckbox.svg';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  errors?: CustomError[];
  type: number;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  errors,
  type,
}) => {
  if (!open) return null;
  return (
    <>
      <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] z-50' />
      <div className='text-center fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-white p-8 z-50 rounded-md font-semibold text-ln flex flex-col items-center'>
        {type === 1 ? (
          <>
            <Image src={rightCheckbox} alt='success' className='w-12 h-12 mb-7' />
            {children}
          </>
        ) : type === 2 ? (
          <>
            <Image src={wrongCheckbox} alt='error' className='w-12 h-12 mb-7' />
            <ul>
              {errors?.map(err => (
                <li key={err.message}>
                  <h1>{err.message.split('.')[0]}</h1>
                  <p className='text-sm font-normal mt-1'>
                    {err.message.split('.')[1]}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : type === 3 ? (
          <>
            <Image src={rightCheckbox} alt='success' className='w-12 h-12 mb-7' />
            <h1>Observación eliminada correctamente</h1>
          </>
        ) : null}
        <button
          className='mt-6 border rounded-md w-full bg-aidam80 text-white h-10 hover:bg-aidam70 active:shadow-active'
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default Modal;
