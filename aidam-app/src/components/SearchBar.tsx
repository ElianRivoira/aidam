import React, { useEffect, useState } from 'react';
import { searchUser } from '@/services/users';

interface Props {
  search: string;
  setSearch: (e: string) => void;
  setActiveUsers?: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}

const SearchBar: React.FC<Props> = ({ search, setSearch, setActiveUsers }) => {
  const [error, setError] = useState<string | null>(null);

  async function fetchSearchedUsers(search: string) {
    try {
      if (search === '') {
        const users = await searchUser('*');
        return users;
      } else {
        const users = await searchUser(search);
        return users;
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  }
  console.log(search)
  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      if (!search) {
        fetchSearchedUsers('*').then(users => {
          if (setActiveUsers) {
            setActiveUsers(users);
          }
        });
      } else {
        fetchSearchedUsers(search).then(users => {
          if (setActiveUsers) {
            setActiveUsers(users);
          }
        });
      }
    }
  };

  return (
    <div className='w-2/3'>
      {error && <div className='text-red-500'>{error}</div>}
      <input
        type='search'
        id='search'
        value={search}
        onChange={e => {
          console.log(e.target.value)
          setSearch(e.target.value)}}
        placeholder='Buscar'
        className='w-full border rounded-full px-4 py-1 shadow-card outline-none focus:shadow-active hover:bg-gray-100 focus:bg-gray-100 transition-all'
        // onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default SearchBar;
