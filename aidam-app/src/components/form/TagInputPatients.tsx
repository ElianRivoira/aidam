import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { hasCookie } from 'cookies-next';
import { useMutation, useQuery } from '@tanstack/react-query';

import x from '@/assets/icons/x-white.svg';
import { searchPatients } from '@/services/patients';
import { unassignPatient } from '@/services/users';
import Modal from '../Modal';
import { createINames } from '@/utils/INames';

interface TagInputProps {
  tagged: INames[];
  setTagged: React.Dispatch<React.SetStateAction<INames[]>>;
  user?: User | undefined;
}

const TagInputPatients: React.FC<TagInputProps> = ({ tagged, setTagged, user }) => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const patients = useQuery({
    queryKey: ['search patients in create prof'],
    enabled: hasCookie('session') && searchText.length > 0,
    queryFn: () => searchPatients(searchText),
  });

  const unassignPat = useMutation({
    mutationFn: unassignPatient,
    onSuccess: response => {
      handleTagRemove(response.patientName);
      setSuccessMsg('El paciente ha sido desvinculado del profesional correctamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  useEffect(() => {
    searchText && patients.refetch();
  }, [searchText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleClickOnPatient = (name: INames, id: string) => {
    setTagged(prevState => {
      if (prevState[0])
        return [
          ...tagged,
          {
            firstName1: name.firstName1,
            firstName2: name.firstName2,
            lastName1: name.lastName1,
            lastName2: name.lastName2,
            id,
          },
        ];
      else
        return [
          {
            firstName1: name.firstName1,
            firstName2: name.firstName2,
            lastName1: name.lastName1,
            lastName2: name.lastName2,
            id,
          },
        ];
    });
    setSearchText('');
  };

  const handleTagRemove = async (patientToDelete: INames) => {
    const filteredPatients = tagged.filter(patient => patient.id !== patientToDelete.id);
    setTagged(filteredPatients);
  };

  return (
    <div className='w-full relative'>
      <label htmlFor='patients' className='text-sm font-normal mb-1 block'>
        Pacientes a cargo
      </label>
      <input
        type='text'
        name='patients'
        value={searchText}
        onChange={handleInputChange}
        className='w-full h-10 rounded-md border border-black02 p-1.5 outline-none focus:border-aidam hover:border-aidam80'
        placeholder='Ejemplo Ejemplo'
      />
      {searchText && (
        <div className='absolute z-20 border bg-white rounded-md flex flex-col gap-2 w-full'>
          {patients.data?.map((patient, index) => (
            <div
              key={index}
              onClick={() => {
                const names = createINames(patient);
                handleClickOnPatient(names, patient._id);
              }}
              className='hover:bg-aidamNav hover:text-white rounded-md p-3 cursor-pointer w-full transition-colors'
            >
              {`${patient.firstName} ${patient.lastName} - ${patient.dni}`}
            </div>
          ))}
        </div>
      )}
      <div className='flex flex-wrap gap-2 mt-2.5'>
        {tagged.map((patient, index) => {
          return (
            <div
              key={index}
              className='bg-[#1F1BB7A3] w-fit rounded-md border border-black02 text-white text-lh font-normal p-1.5 pr-2 flex items-center'
            >
              <button
                onClick={() => {
                  user && unassignPat.mutate({ id: user._id, patient });
                }}
                className='flex items-center mr-1'
                type='button'
              >
                <Image src={x} alt='x' width={20} />
              </button>
              {patient.firstName1} {patient.firstName2} {patient.lastName1} {patient.lastName2}
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} type={type} errors={errors}>
        <h1>{successMsg}</h1>
      </Modal>
    </div>
  );
};

export default TagInputPatients;
