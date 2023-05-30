import React, { useRef } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import Image from 'next/image';

import x from '@/assets/icons/x.svg';

interface CreateObsProps {
  open: boolean;
  onClose: () => void;
  postObs: UseMutationResult<Observation, any, PostObservation, unknown>;
  patient: Patient | undefined;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

const CreateObs: React.FC<CreateObsProps> = ({ open, onClose, postObs, patient, date, setDate }) => {
  if (!open) return null;
  const titleRef = useRef<HTMLInputElement>(null);
  const obsRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titleRef.current && obsRef.current && patient) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const dateObs = new Date(`${date}T${hours}:${minutes}:00`);
      postObs.mutate({
        title: titleRef.current.value,
        date: dateObs,
        observation: obsRef.current.value,
        patientId: patient._id,
      });
    }
  };

  return (
    <>
      <div onClick={onClose} className='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] z-50' />
      <div className='fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-white p-4 w-full lg:w-[40%] max-w-[530px] z-50 rounded-md flex flex-col items-center'>
        <button className='w-fit self-end' onClick={onClose}>
          <Image src={x} alt='salir' />
        </button>
        <div className='flex flex-col px-3.5 w-full'>
          <div className='w-full flex flex-col'>
            <h1 className='self-center mb-6 text-xl2 font-medium'>Nueva observación</h1>
            <hr className='border-black03' />
          </div>
          <form onSubmit={handleSubmit} className='my-6 flex flex-col gap-3'>
            <input
              ref={titleRef}
              type='text'
              id='title'
              name='title'
              placeholder='Título'
              className='p-1.5 font-medium border border-black02 rounded-md block outline-none focus:border-aidam hover:border-aidam80 transition-colors'
            />
            <input
              type='date'
              value={date}
              onChange={e => {
                setDate(e.target.value);
              }}
              id='title'
              name='title'
              placeholder='Título'
              className='p-1.5 font-medium border border-black02 rounded-md block outline-none focus:border-aidam hover:border-aidam80 transition-colors'
            />
            <textarea
              ref={obsRef}
              name='obs'
              id='obs'
              cols={30}
              rows={15}
              placeholder='Describa su observación'
              className='p-1.5 border border-black02 rounded-md resize-none outline-none focus:border-aidam hover:border-aidam80 transition-colors'
            ></textarea>
            <button
              type='submit'
              className='border rounded-md w-full bg-aidam80 text-white h-10 hover:bg-aidam70 active:shadow-active transition-colors'
            >
              Crear
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateObs;
