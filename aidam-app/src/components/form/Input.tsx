import Image from 'next/image';
import React, { useState } from 'react';

import openEye from '../../assets/icons/openEye.svg';

interface inputProps {
  label: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  isEqual?: boolean;
  validate?: boolean;
  pattern?: string;
  name?: string;
}

const Input: React.FC<inputProps> = ({
  label,
  type,
  onChange,
  value,
  isEqual,
  validate,
  pattern,
  name,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='w-full'>
      <label htmlFor={name ? name : label} className='text-sm font-normal mb-1 block'>
        {label}
      </label>
      {type === 'password' ? (
        <div className='relative'>
          {}
          <input
            onChange={onChange}
            type={visible ? 'text' : 'password'}
            id={label}
            name={label}
            value={value}
            className={`w-full h-10 rounded-md border ${
              validate
                ? isEqual
                  ? 'border-exito'
                  : 'border-error'
                : 'border-black02'
            } p-1.5 outline-none ${value ? '' : 'hover:border-aidam80'}`}
            required
            pattern={pattern}
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
      ) : type === 'file' ? (
        <input
          id={label}
          name={name ? name : label}
          type={type}
          className='w-full h-10 border-black02 mb-2.5 outline-none focus:border-aidam hover:border-aidam80'
          onChange={onChange}
        />
      ) : (
        <input
          id={label}
          name={name ? name : label}
          type={type}
          className='w-full h-10 rounded-md border border-black02 mb-2.5 p-1.5 outline-none focus:border-aidam hover:border-aidam80'
          onChange={onChange}
          value={value}
          required
          pattern={pattern}
        />
      )}
    </div>
  );
};

export default Input;
