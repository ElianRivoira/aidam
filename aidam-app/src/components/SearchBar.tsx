import React, { useState } from 'react';

const SearchBar = () => {
  const [search, setSearch] = useState('');

  return (
    <div className='w-2/3'>
      <input
        type='search'
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder='Buscar'
        className='w-full border rounded-full px-4 py-1 shadow-card outline-none'
      />
    </div>
  );
};

export default SearchBar;
