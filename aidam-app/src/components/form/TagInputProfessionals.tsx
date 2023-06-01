import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { hasCookie } from 'cookies-next';
import { useMutation, useQuery } from '@tanstack/react-query';

import x from '@/assets/icons/x-white.svg';
import { searchUser } from '@/services/users';
import { unassignProf } from '@/services/patients';
import Modal from '../Modal';
import { createINames } from '@/utils/INames';

interface TagInputProps {
  tagged: INames[];
  setTagged: React.Dispatch<React.SetStateAction<INames[]>>;
  patient?: Patient | undefined;
}

const TagInput: React.FC<TagInputProps> = ({ tagged, setTagged, patient }) => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const professionals = useQuery({
    queryKey: ['search professionals in create prof'],
    enabled: hasCookie('session') && searchText.length > 0,
    queryFn: () => searchUser(searchText),
  });

  const unassignProfessional = useMutation({
    mutationFn: unassignProf,
    onSuccess: response => {
      handleTagRemove(response.profName);
      setSuccessMsg('El profesional ha sido desvinculado del paciente correctamente');
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
    searchText && professionals.refetch();
  }, [searchText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleClickOnProf = (name: INames, id: string) => {
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

  const handleTagRemove = async (profToDelete: INames) => {
    // Eliminar el usuario etiquetado de la lista
    const filteredProfs = tagged.filter(
      prof =>
        prof.id !== profToDelete.id
    );
    setTagged(filteredProfs);
  };

  return (
    <div className='w-full relative'>
      <label htmlFor='profs' className='text-sm font-normal mb-1 block'>
        Profesionales a cargo
      </label>
      <input
        type='text'
        name='profs'
        value={searchText}
        onChange={handleInputChange}
        className='w-full h-10 rounded-md border border-black02 p-1.5 outline-none focus:border-aidam hover:border-aidam80'
        placeholder='Buscar...'
      />
      {searchText && (
        <div className='absolute z-20 border bg-white rounded-md flex flex-col gap-2 w-full'>
          {professionals.data?.map(
            (prof, index) =>
              !prof.admin && (
                <div
                  key={index}
                  onClick={() => {
                    const names = createINames(prof);
                    handleClickOnProf(names, prof._id);
                  }}
                  className='hover:bg-aidamNav hover:text-white rounded-md p-3 cursor-pointer w-full transition-colors'
                >
                  {`${prof.firstName} ${prof.lastName} - ${prof.profession}`}
                </div>
              )
          )}
        </div>
      )}
      <div className='flex flex-wrap gap-2 mt-2.5'>
        {tagged.map((prof, index) => {
          return (
            <div
              key={index}
              className='bg-[#1F1BB7A3] w-fit rounded-md border border-black02 text-white text-lh font-normal p-1.5 pr-2 flex items-center'
            >
              <button
                onClick={() => {
                  console.log('PROFF', prof)
                  patient && unassignProfessional.mutate({ id: patient._id, prof });
                }}
                className='flex items-center mr-1'
                type='button'
              >
                <Image src={x} alt='x' width={20} />
              </button>
              {prof.firstName1} {prof.firstName2} {prof.lastName1} {prof.lastName2}
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

export default TagInput;
