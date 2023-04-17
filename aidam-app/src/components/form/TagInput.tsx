import Image from 'next/image';
import React, { useState } from 'react';

import x from '@/assets/icons/x-white.svg';

function TagInput() {
  const [taggedProfs, setTaggedProfs] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Buscar usuarios con el texto ingresado y agregarlos a la lista de usuarios etiquetados
      setTaggedProfs(prevState => {
        if (prevState[0]) return [...taggedProfs, searchText];
        else return [searchText];
      });
      setSearchText('');
    }
  };

  const handleTagRemove = (prof: string) => {
    // Eliminar el usuario etiquetado de la lista
    const filteredProfs = taggedProfs.filter(proff => proff !== prof);
    setTaggedProfs(filteredProfs);
  };

  return (
    <div className='w-full'>
      <label htmlFor='profs' className='text-sm font-normal mb-1 block'>Profesionales a cargo</label>
      <input
        type='text'
        name='profs'
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='w-full h-10 rounded-md border border-black02 mb-2.5 p-1.5 outline-none focus:border-aidam hover:border-aidam80'
      />
      <div className='flex flex-wrap gap-2'>
        {taggedProfs.map((prof, index) => {
          return (
            <div key={index} className='bg-[#1F1BB7A3] w-fit rounded-md border border-black02 text-white text-lh font-normal p-1.5 pr-2 flex items-center'>
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
}

export default TagInput;
