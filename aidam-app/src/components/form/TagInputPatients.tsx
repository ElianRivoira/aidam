import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { hasCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';

import x from '@/assets/icons/x-white.svg';
import { searchPatients } from '@/services/patients';
import { unassignPatient } from '@/services/users';

interface TagInputProps {
  tagged: INames[];
  setTagged: React.Dispatch<React.SetStateAction<INames[]>>;
  user?: User | undefined;
}

const TagInputPatients: React.FC<TagInputProps> = ({
  tagged,
  setTagged,
  user,
}) => {
  const [searchText, setSearchText] = useState('');

  const patients = useQuery({
    queryKey: ['search patients in cp'],
    enabled: hasCookie('session') && searchText.length > 0,
    queryFn: () => searchPatients(searchText),
  });

  useEffect(() => {
    searchText && patients.refetch();
  }, [searchText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleClickOnPatient = (name: INames) => {
    setTagged(prevState => {
      if (prevState[0])
        return [
          ...tagged,
          {
            firstName1: name.firstName1,
            firstName2: name.firstName2,
            lastName1: name.lastName1,
            lastName2: name.lastName2,
          },
        ];
      else
        return [
          {
            firstName1: name.firstName1,
            firstName2: name.firstName2,
            lastName1: name.lastName1,
            lastName2: name.lastName2,
          },
        ];
    });
    setSearchText('');
  };

  const handleTagRemove = async (patientToDelete: INames) => {
    const filteredPatients = tagged.filter(patient => patient !== patientToDelete);
    setTagged(filteredPatients);
    user && (await unassignPatient(user._id, patientToDelete));
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
          {patients.data?.map((prof, index) => (
            <div
              key={index}
              onClick={() => {
                let firstName1: string = '';
                let firstName2: string = '';
                let lastName1: string = '';
                let lastName2: string = '';

                if (prof.firstName.includes(' ')) {
                  [firstName1, firstName2] = prof.firstName.split(' ');
                } else firstName1 = prof.firstName;

                if (prof.lastName.includes(' ')) {
                  [lastName1, lastName2] = prof.lastName.split(' ');
                } else lastName1 = prof.lastName;

                handleClickOnPatient({
                  firstName1,
                  firstName2,
                  lastName1,
                  lastName2,
                });
              }}
              className='hover:bg-aidamNav hover:text-white rounded-md p-3 cursor-pointer w-full transition-colors'
            >
              {`${prof.firstName} ${prof.lastName}`}
            </div>
          ))}
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
                onClick={() => handleTagRemove(prof)}
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
    </div>
  );
};

export default TagInputPatients;
