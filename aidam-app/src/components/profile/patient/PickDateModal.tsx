import React from 'react';
import Image from 'next/image';

import { formatStringPickDate } from '@/utils/formatDate';
import x from '@/assets/icons/x.svg';

interface PickDateModalProps {
  open: boolean;
  onClose: () => void;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  date: Date;
}

const PickDateModal: React.FC<PickDateModalProps> = ({
  open,
  onClose,
  setDate,
  date,
}) => {
  if (!open) return null;

  const newDate = (value: string) => {
    let [year, month] = value.split('-');
    const numberYear = Number(year);
    const numberMonth = Number(month) - 1;
    const date = new Date(numberYear, numberMonth);
    setDate(date);
  };

  return (
    <>
      <div
        onClick={onClose}
        className='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] z-50'
      />
      <div className='text-center fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-white p-4 z-50 rounded-md flex flex-col items-center'>
        <button className='self-end' onClick={onClose}>
          <Image src={x} alt='cerrar' />
        </button>
        <h1 className='font-semibold text-ln'>Seleccione el mes</h1>
        <div className='p-2.5 pt-0'>
          <input
            type='month'
            min='2023-03'
            onChange={e => {
              newDate(e.target.value);
            }}
            value={formatStringPickDate(date)}
            className='border border-black02 px-3 py-2 mt-5 outline-none rounded-md'
          />
          <button
            className='mt-6 border rounded-md w-full bg-aidam80 text-white h-10 hover:bg-aidam70 active:shadow-active transition-colors'
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </>
  );
};

export default PickDateModal;
