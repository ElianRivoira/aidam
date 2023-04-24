import Image from 'next/image';
import React, { useState } from 'react';

import openEye from '@/assets/icons/openEye.svg';
import upload from '@/assets/icons/upload.svg';

interface inputProps {
  label: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value?: string | number;
  isEqual?: boolean;
  validate?: boolean;
  pattern?: string;
  name: string;
  placeholder?: string;
  valuesArray?: string[];
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
  placeholder,
  valuesArray,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='w-full'>
      <label htmlFor={name} className='text-sm font-normal mb-1 block'>
        {label}
      </label>
      {type === 'password' ? (
        <div className='relative'>
          {}
          <input
            onChange={onChange}
            type={visible ? 'text' : 'password'}
            id={name}
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
        <>
          <label
            htmlFor={name}
            className='w-full flex h-10 rounded-md mb-2.5 justify-center items-center border border-black02 hover:border-aidam80 transition-colors cursor-pointer'
          >
            {value ? (
              value
            ) : (
              <>
                <Image src={upload} alt='upload'></Image>
              </>
            )}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            className='hidden'
            onChange={onChange}
          />
        </>
      ) : type === 'select' ? (
        <select
          name='profession'
          id='profession'
          onChange={onChange}
          className='w-full h-10 rounded-md border border-black02 mb-2.5 p-1.5 outline-none focus:border-aidam hover:border-aidam80 transition-colors'
        >
          {valuesArray?.map((profession, index) => (
            <option value={profession} key={index}>
              {profession}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className='w-full h-10 rounded-md border border-black02 mb-2.5 p-1.5 outline-none focus:border-aidam hover:border-aidam80 transition-colors'
          onChange={onChange}
          value={value}
          required
          pattern={pattern}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default Input;
