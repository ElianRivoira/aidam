import React, { Dispatch, SetStateAction } from 'react';

interface MyObject {
  [key: string]: boolean;
}

interface InputProps {
  onChangeCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  array: Array<string>;
  booleanObject: MyObject;
  title?: string;
  valueSetter?: Dispatch<SetStateAction<string>>;
  inputText?: string;
  placeholder?: string;
}

export const FisiatricCheck: React.FC<InputProps> = ({
  onChangeCheck,
  array,
  booleanObject,
  title,
  inputText,
  valueSetter,
  placeholder,
}) => {
  let i: number = 1;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (valueSetter) {
      valueSetter(e.target.value);
    }
  };
  return (
    <div className='w-2/3'>
      {title ? <h3 className='font-bold'>{title}: </h3> : ''}
      <div className='flex flex-wrap w-full gap-2'>
        {array
          ? array.map((type, index) => {
              let iString: string = i.toString();
              let html = (
                <label className='flex gap-2'>
                  <p>{type}</p>
                  <input
                    type='checkbox'
                    name={`checkbox${iString}`}
                    checked={booleanObject[`checkbox${iString}`]}
                    onChange={onChangeCheck}
                  />
                  
                </label>
              );
              i++;
              return html;
            })
          : ''}
      </div>
      {inputText ? (
        <label htmlFor='patologia' className='flex gap-2 w-full'>
          <p>{inputText}:</p>
          <input
            type='text'
            placeholder={placeholder}
            className='px-1 w-full'
            onChange={handleChange}
          />
        </label>
      ) : (
        ''
      )}
    </div>
  );
};
