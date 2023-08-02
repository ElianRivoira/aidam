import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { searchUser } from '@/services/users';
import searchIcon from '@/assets/icons/search.svg';
import x from '@/assets/icons/x.svg';
import styles from '@/styles/SearchBar.module.css';

interface Props {
  search: string;
  setSearch: (e: string) => void;
  setActiveUsers?: React.Dispatch<React.SetStateAction<User[] | undefined>>;
  width?: string;
  getPatients?: (
    search: string,
    optionalPageNumber?: number,
    resetPatients?: boolean
  ) => Promise<void>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setObserver?: (node: any) => void;
  lastPatientRef?: HTMLDivElement | null;
  pageNumber?: number;
}

const SearchBar: React.FC<Props> = ({
  search,
  setSearch,
  setActiveUsers,
  width,
  getPatients,
  setIsLoading,
  setObserver,
  lastPatientRef,
  pageNumber,
}) => {
  const [error, setError] = useState<string | null>(null);

  async function fetchSearchedUsers(search: string) {
    try {
      setIsLoading && setIsLoading(true);
      const users = await searchUser(search);
      setActiveUsers && setActiveUsers(users);
      setIsLoading && setIsLoading(false);
    } catch (error) {
      setError(`Algo salió mal. Inténtelo nuevamente.`);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (window) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
    getPatients && (await getPatients(search ? search : '*', 0, true));
    setActiveUsers && (await fetchSearchedUsers(search ? search : '*'));
  };
  
  useEffect(() => {
    setObserver && setObserver(lastPatientRef);
  }, [lastPatientRef, pageNumber]);
  
  const clearButton = async () => {
    setSearch('');
    
    if (window) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
    getPatients && (await getPatients('*', 0, true));
    setActiveUsers && (await fetchSearchedUsers('*'));
  };

  return (
    <div className={`${width ? width : 'w-2/3'} flex flex-col items-center`}>
      {error && <div className='text-red-500'>{error}</div>}
      <form onSubmit={handleSubmit} className='relative flex items-center w-full'>
        <input
          type='search'
          id='search'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Buscar ...'
          className={`${search ? 'pl-8' : ''} ${
            styles.searchBar
          } w-full border rounded-full px-4 py-1 shadow-card outline-none focus:shadow-active hover:bg-gray-100 focus:bg-gray-100 transition-all`}
        />
        {search && (
          <button type='button' onClick={clearButton} className='absolute w-fit left-3'>
            <Image src={x} alt='clear button' className='w-[18px]' />
          </button>
        )}
        <button type='submit' className='absolute w-fit right-4'>
          <Image src={searchIcon} alt='search' className='w-[22px]' />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
