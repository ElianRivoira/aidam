import React, { useState, useEffect } from 'react';
import { hasCookie } from 'cookies-next';
import { UseMutationResult, useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { getObservation } from '@/services/observations';
import x from '@/assets/icons/x.svg';

interface ObsModalProps {
  openDeleteModal: () => void;
  obsId: string;
  putObs: UseMutationResult<Observation, any, PutObservation, unknown>;
  open: boolean;
  patientId: string | undefined;
  onClose: () => void;
}
interface Fecha {
  fecha: string;
  hora: string;
  minutos: string;
}

const ObsModal: React.FC<ObsModalProps> = ({ openDeleteModal, obsId, putObs, open, patientId, onClose }) => {
  if (!open) return null;
  const [readonly, setReadonly] = useState(true);
  const [date, setDate] = useState<Fecha>();
  const [obsText, setObsText] = useState('');

  const observation = useQuery({
    queryKey: ['observation', obsId],
    enabled: hasCookie('session'),
    queryFn: () => getObservation(obsId),
  });

  const handleEdit = () => {
    setReadonly(true);
    patientId &&
      putObs.mutate({
        id: obsId,
        text: obsText,
        patientId: patientId,
      });
  };

  useEffect(() => {
    if (observation.data?.date) {
      let [fecha, hora] = new Date(observation.data.date).toLocaleString('es-ES').split(',');
      let minutos: string;
      [hora, minutos] = hora.split(':');
      setDate({ fecha, hora, minutos });
    }
    if (observation.data?.observation) {
      setObsText(observation.data.observation);
    }
  }, [observation.isSuccess]);

  return (
    <>
      <div onClick={onClose} className='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] z-50' />
      <div className='fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-white p-4 w-full lg:w-[40%] max-w-[530px] z-50 rounded-md flex flex-col items-center'>
        <button className='w-fit self-end' onClick={onClose}>
          <Image src={x} alt='salir' />
        </button>
        <div className='w-full flex flex-col'>
          <h1 className='w-full mb-6 text-xl2 font-medium text-center'>{observation.data?.title}</h1>
          <hr className='border-black03 w-full' />
        </div>
        <div className='w-full px-2.5'>
          <div className='my-6 ml-2.5 self-start'>
            <h1 className='text-xb font-medium'>
              {typeof observation.data?.professional === 'object'
                ? `${observation.data.professional.firstName} ${observation.data.professional.lastName}`
                : null}
            </h1>
            {date ? <p className='text-sm'>{`${date?.fecha}, ${date?.hora}:${date?.minutos} hs`}</p> : null}
          </div>
          <textarea
            readOnly={readonly}
            onChange={e => setObsText(e.target.value)}
            rows={15}
            className={`flex w-full min-h-[200px] rounded-2xl p-3 shadow-card mb-[26px] text-lb font-normal resize-none cursor-default outline-none ${
              readonly ? '' : 'border border-aidam hover:border-aidam cursor-text'
            }`}
            value={obsText}
          ></textarea>
          <div className='flex gap-3 justify-end w-full'>
            {readonly ? (
              <button
                onClick={() => setReadonly(false)}
                className='flex items-center text-sm lg:text-lm lg:font-medium font-normal text-white lgMax:h-7.5 p-2.5 rounded-md bg-aidam80 hover:bg-aidam70'
              >
                Editar
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className='flex items-center text-sm lg:text-lm lg:font-medium font-normal text-white lgMax:h-7.5 p-2.5 rounded-md bg-aidam80 hover:bg-aidam70'
              >
                Confirmar
              </button>
            )}
            <button
              onClick={openDeleteModal}
              className='flex items-center text-sm lg:text-lm lg:font-medium font-normal text-white lgMax:h-7.5 p-2.5 rounded-md bg-redLogout hover:bg-redLogout/[0.9]'
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObsModal;
