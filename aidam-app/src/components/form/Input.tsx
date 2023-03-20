import Image from 'next/image';
import React, { useState } from 'react';

import openEye from '../../assets/icons/openEye.svg';

interface inputProps {
  label: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  isEqual?: boolean;
  validate?: boolean;
}

const Input: React.FC<inputProps> = ({ label, type, onChange, value, isEqual, validate }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='w-full'>
      <label htmlFor={label} className='text-sm font-normal mb-1 block'>
        {label}
      </label>
      {type === 'password' ? (
        <div className='relative'>
          {}
          <input
            onChange={onChange}
            type={visible ? 'text' : 'password'}
            id='password'
            value={value}
            className={`w-full h-10 rounded-md border ${validate ? isEqual ? 'border-exito' : 'border-error' : 'border-black02'} p-1.5 outline-none ${value ? '' : 'hover:border-aidam80'}`}
            required
          ></input>
          <div className='absolute inset-y-0 right-2 pl-3 flex items-center'>
            <button
              type='button'
              className='h-5 w-5 object-cover'
              onClick={() => setVisible(!visible)}
            >
              <Image src={openEye} alt='ojito' className='w-4 h-4'></Image>
            </button>
          </div>
        </div>
      ) : (
        <input
          type={type}
          className='w-full h-10 rounded-md border border-black02 mb-2.5 p-1.5 outline-none focus:border-aidam hover:border-aidam80'
          onChange={onChange}
          value={value}
          required
        />
      )}
    </div>
  );
};

export default Input;
