import React from 'react';
import Image from 'next/image';

import x from '@/assets/icons/x.svg';
import { TextInput } from '../Inputs';

interface Props {
  breakpoint: boolean;
  collectedData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (name: string) => void;
  handleAdd: () => void;
  dataToMap: any;
  inputs: IDataToMapInputs[];
  title: string;
  subtitle?: string;
}

const SetTableData: React.FC<Props> = ({
  breakpoint,
  handleDelete,
  collectedData,
  handleChange,
  handleAdd,
  dataToMap,
  inputs,
  title,
  subtitle,
}) => {
  return (
    <>
      <h3 className={`font-medium text-ln underline ${subtitle ? 'mt-2' : 'my-2'}`}>{title}</h3>
      {subtitle && <p className='mb-2'>{subtitle}</p>}
      {breakpoint && (
        <div className='flex gap-3 flex-wrap mb-3'>
          {dataToMap.map((data: any) => (
            <div key={data[inputs[0].name]} className='flex gap-1 border rounded-md bg-slate-200 items-center p-1 pr-1.5'>
              <button type='button' onClick={() => handleDelete(data[inputs[0].name])} className='w-5 h-5'>
                <Image src={x} alt='eliminar' />
              </button>
              <p className='text-lb'>{data[inputs[0].name]}</p>
            </div>
          ))}
        </div>
      )}
      <div className='flex lg:flex-col'>
        {!breakpoint && (
          <>
            <div className='flex gap-2 mb-3'>
              <div className='w-[2%]'></div>
              {inputs.map(data => (
                <h4 key={data.label} className={`text-ln font-medium ${data.width}`}>
                  {data.label}
                </h4>
              ))}
            </div>
            {dataToMap.map((data: any) => (
              <div key={data.name} className='flex gap-2 mb-2'>
                <button type='button' onClick={() => handleDelete(data.name)} className='w-[2%]'>
                  <Image src={x} alt='eliminar' />
                </button>
                {inputs.map(inputData => (
                  <p key={inputData.name} className={`text-lb ${inputData.width}`}>{data[inputData.name]}</p>
                ))}
              </div>
            ))}
          </>
        )}
        <div className='w-full flex lgMax:flex-col gap-2 lg:justify-between'>
          {!breakpoint && <div className='w-[2%]'></div>}
          {inputs.map((data, index) => (
            <div key={index} className={`${breakpoint ? `w-full` : `${data.width}`}`}>
              <TextInput
                label={breakpoint ? data.label : ''}
                divclass={breakpoint ? '' : 'block'}
                name={data.name}
                labelclass={breakpoint ? '' : 'mr-0'}
                value={collectedData[data.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type='button'
        className='flex items-center text-lm font-medium p-2.5 my-3 text-white rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
        onClick={handleAdd}
      >
        Agregar
      </button>
    </>
  );
};

export default SetTableData;
