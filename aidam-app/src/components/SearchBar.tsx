import React, { useEffect, useState } from 'react';
import { getAllUsers, searchUser } from '@/services/users';

interface Props {
  search: string;
  setSearch: (e: string) => void;
  setActiveUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}

const SearchBar: React.FC<Props> = ({ search, setSearch, setActiveUsers }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function getAll() {
    try {
      let users = await getAllUsers();
      setUsers(users);
      let activeUsers = users.filter((user) => user.status === true);
      setActiveUsers(activeUsers);
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    }
  }

  async function fetchSearchedUsers(search: string) {
    try {
      if (search === '') {
        setUsers(await searchUser('*'));
      } else {
        setUsers(await searchUser(search));
      }
      setActiveUsers(users);
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (!search) {
      getAll();
    } else {
      fetchSearchedUsers(search).then(() => {
        if (isMounted) {
          setActiveUsers(users);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [search]);

  return (
    <div className='w-2/3'>
      {error && <div className='text-red-500'>{error}</div>}
      <input
        type='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Buscar'
        className='w-full border rounded-full px-4 py-1 shadow-card outline-none'
      />
    </div>
  );
};

export default SearchBar;
