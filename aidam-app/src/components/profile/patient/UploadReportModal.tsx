import React from 'react';
import Image from 'next/image';

import x from '@/assets/icons/x.svg';
import upload from '@/assets/icons/upload.svg';

interface UploadReportModalProps {
  open: boolean;
  onClose: () => void;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
}

const UploadReportModal: React.FC<UploadReportModalProps> = ({
  open,
  onClose,
  handleFile,
  handleSubmit,
  value,
}) => {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] z-50'
      />
      <div className='text-center min-w-[350px] fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-white p-4 z-50 rounded-md flex flex-col items-center'>
          <button className='self-end' onClick={onClose}>
            <Image src={x} alt='cerrar' />
          </button>
        <h1 className='font-semibold text-ln mb-4'>Seleccione el archivo</h1>
        <form className='p-2.5 pt-0 w-full' encType='UTF-8' onSubmit={handleSubmit}>
        <>
          <label
            htmlFor='report'
            className='w-full flex h-10 rounded-md justify-center items-center border border-black02 hover:border-aidam80 transition-colors cursor-pointer'
          >
            {value ? (
              value
            ) : (
              <>
                <Image src={upload} alt='upload'></Image>
              </>
            )}
          </label>
          <input
            id='report'
            name='report'
            type='file'
            className='hidden'
            onChange={handleFile}
          />
        </>
          <button
            className='mt-6 border rounded-md w-full bg-aidam80 text-white h-10 hover:bg-aidam70 active:shadow-active transition-colors'
            type='submit'
          >
            Aceptar
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadReportModal;
