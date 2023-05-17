import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  name: string;
  label?: string;
  divclass?: string;
  labelclass?: string;
  minRows?: number;
  optionsArray?: string[];
  flex?: boolean;
}

interface TextAreaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  placeholder?: string;
  name: string;
  label?: string;
  divclass?: string;
  labelclass?: string;
  minRows?: number;
  flex?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  onChange,
  value,
  placeholder,
  name,
  label,
  divclass,
  labelclass,
  minRows,
}) => {
  return (
    <div className={`flex flex-col ${divclass}`}>
      <label
        htmlFor={name}
        className={`${labelclass} ${
          labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb'
        } font-medium mb-2`}
      >
        {label}
      </label>
      <TextareaAutosize
        required
        name={name}
        id={name}
        placeholder={placeholder}
        minRows={minRows ? minRows : 5}
        value={value}
        onChange={onChange}
        className='rounded-md lgMax:text-ss p-1.5 w-full shadow-xm resize-none outline-none border border-gray-100 hover:border-aidam80 transition-colors'
      />
    </div>
  );
};

export const DateInput: React.FC<InputProps> = ({
  onChange,
  value,
  name,
  label,
  divclass,
  labelclass,
}) => {
  return (
    <div className={`flex ${divclass} items-center`}>
      <label
        htmlFor={name}
        className={`${labelclass} ${
          labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb'
        } font-medium mr-2`}
      >
        {label}
      </label>
      <input
        required
        type='date'
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className='outline-none lgMax:text-lb border border-background hover:border-aidam80 rounded-md transition-colors'
      />
    </div>
  );
};

export const RadioInput: React.FC<InputProps> = ({
  onChange,
  value,
  name,
  label,
  divclass,
  labelclass,
  optionsArray,
}) => {
  return (
    <fieldset className={`flex gap-2 flex-wrap justify-between ${divclass}`}>
      <legend
        className={`${labelclass} ${
          labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb'
        } font-medium mr-2 mb-2`}
      >
        {label}
      </legend>
      {optionsArray?.map(itemValue => (
        <div className='flex gap-2 items-center' key={itemValue}>
          <label htmlFor={itemValue}>{itemValue}</label>
          <input
            required
            type='radio'
            id={itemValue}
            name={name}
            value={itemValue}
            checked={value === itemValue}
            onChange={onChange}
          />
        </div>
      ))}
    </fieldset>
  );
};

export const TextInput: React.FC<InputProps> = ({
  onChange,
  value,
  name,
  label,
  divclass,
  labelclass,
}) => {
  return (
    <div className={`w-full flex items-center ${divclass}`}>
      <label
        htmlFor={name}
        className={`font-normal mr-1 ${labelclass} ${
          labelclass?.includes('text') ? '' : 'text-lm'
        }`}
      >
        {label}
      </label>
      <input
        required
        type='text'
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className='w-full flex-1 px-1.5 border border-background hover:border-aidam80 rounded-md transition-colors outline-none'
      />
    </div>
  );
};
