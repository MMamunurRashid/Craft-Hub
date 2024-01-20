// useSearchValue.js

import { useState } from 'react';

const useSearchValue = () => {
  const [searchValue, setSearchValue] = useState('');
  // console.log('search value', searchValue);

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
  };

  return [searchValue, handleSearchInputChange];
};

export default useSearchValue;
