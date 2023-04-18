import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { hasCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';

import x from '@/assets/icons/x-white.svg';
import { searchUser } from '@/services/users';

interface TagInputProps {
  taggedProfs: string[];
  setTaggedProfs: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ taggedProfs, setTaggedProfs }) => {
  const [searchText, setSearchText] = useState('');

  const professionals = useQuery({
    queryKey: ['search professionals in cp'],
    enabled: hasCookie('session') && searchText.length > 0,
    queryFn: () => searchUser(searchText),
  });

  useEffect(() => {
    searchText && professionals.refetch();
  }, [searchText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const setTags = (name?: string) => {
    setTaggedProfs(prevState => {
      if (prevState[0]) return [...taggedProfs, name ? name : searchText];
      else return [name ? name : searchText];
    });
    setSearchText('');
  };

  const handleClickOnProf = (name: string) => {
    setTags(name);
  };

  const handleTagRemove = (prof: string) => {
    // Eliminar el usuario etiquetado de la lista
    const filteredProfs = taggedProfs.filter(proff => proff !== prof);
    setTaggedProfs(filteredProfs);
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
      />
      {searchText && (
        <div className='absolute border bg-white rounded-md flex flex-col gap-2 w-full'>
          {professionals.data?.map((prof, index) => (
            <div
              key={index}
              onClick={() =>
                handleClickOnProf(`${prof.firstName} ${prof.lastName}`)
              }
              className='hover:bg-aidamNav hover:text-white rounded-md p-3 cursor-pointer w-full transition-colors'
            >
              {`${prof.firstName} ${prof.lastName}`}
            </div>
          ))}
        </div>
      )}
      <div className='flex flex-wrap gap-2 mt-2.5'>
        {taggedProfs.map((prof, index) => {
          return (
            <div
              key={index}
              className='bg-[#1F1BB7A3] w-fit rounded-md border border-black02 text-white text-lh font-normal p-1.5 pr-2 flex items-center'
            >
              <button
                onClick={() => handleTagRemove(prof)}
                className='flex items-center mr-1'
              >
                <Image src={x} alt='x' width={20} />
              </button>
              {prof}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagInput;
