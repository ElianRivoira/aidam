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
  internalDivClass?: string;
  inputclass?: string;
  required?: boolean;
}

interface CheckboxProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: { [key: string]: any };
  placeholder?: string;
  name: string;
  label?: string;
  divclass?: string;
  labelclass?: string;
  minRows?: number;
  optionsArray?: string[];
  internalDivClass?: string;
  optionsClass?: string;
  required?: boolean;
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
        className={`${labelclass} ${labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb'} font-medium mb-2`}
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

export const DateInput: React.FC<InputProps> = ({ onChange, value, name, label, divclass, labelclass }) => {
  return (
    <div className={`flex ${divclass} items-center`}>
      <label
        htmlFor={name}
        className={`${labelclass} ${labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb'} font-medium mr-2`}
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
  internalDivClass,
}) => {
  return (
    <fieldset className={`${divclass ? divclass : 'flex gap-2 flex-wrap'}`}>
      {internalDivClass ? (
        <div className={`${internalDivClass}`}>
          <legend
            className={`${labelclass ? labelclass : 'mr-2 mb-2'} ${
              labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb font-medium'
            }`}
          >
            {label}
          </legend>
          {optionsArray?.map(itemValue => (
            <div className='flex gap-2 items-center' key={itemValue}>
              <label htmlFor={itemValue} className='text-lb lgMax:text-lm'>
                {itemValue.split('.')[0]}
              </label>
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
        </div>
      ) : (
        <>
          {label ? (
            <legend
              className={`${labelclass ? labelclass : 'mr-2 mb-2'} ${
                labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb font-medium'
              }`}
            >
              {label}
            </legend>
          ) : null}
          {optionsArray?.map(itemValue => (
            <div className={`flex gap-2 items-center`} key={itemValue}>
              <label htmlFor={itemValue}>{itemValue.split('.')[0]}</label>
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
        </>
      )}
    </fieldset>
  );
};

export const CheckboxInput: React.FC<CheckboxProps> = ({
  onChange,
  value,
  name,
  label,
  divclass,
  labelclass,
  optionsArray,
  internalDivClass,
  optionsClass,
}) => {
  const isISocialSecurity = (obj: any): obj is ISocialSecurity => {
    return obj && obj.AUH && obj.AUHD && obj.SUAF && obj.PNC;
  };

  const isChecked = (itemValue: string): boolean => {
    let retrn = false;
    if (isISocialSecurity(value)) {
      if (value[itemValue].checked) retrn = true;
    } else {
      if (value[itemValue] === itemValue) retrn = true;
    }
    return retrn;
  };

  return (
    <fieldset className={`${divclass ? divclass : 'flex gap-2 flex-wrap justify-between'}`}>
      {internalDivClass ? (
        <div className={`${internalDivClass}`}>
          <legend
            className={`${labelclass ? labelclass : 'mr-2 mb-2'} ${
              labelclass?.includes('text') ? '' : 'text-lb lgMax:text-lm'
            }`}
          >
            {label}
          </legend>
          {optionsArray?.map(itemValue => (
            <div className={`flex gap-2 items-center justify-between ${optionsClass}`} key={itemValue}>
              <label htmlFor={itemValue} className='text-lb lgMax:text-lm'>
                {itemValue.split('.')[0]}
              </label>
              <input
                type='checkbox'
                id={itemValue}
                name={name}
                value={itemValue}
                checked={isChecked(itemValue)}
                onChange={onChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {label ? (
            <legend
              className={`${labelclass} ${
                labelclass?.includes('text') ? '' : 'text-ln lgMax:text-lb font-medium'
              } mr-2 mb-2`}
            >
              {label}
            </legend>
          ) : null}
          {optionsArray?.map(itemValue => (
            <div className={`flex gap-2 items-center`} key={itemValue}>
              <label htmlFor={itemValue}>{itemValue.split('.')[0]}</label>
              <input
                type='checkbox'
                id={itemValue}
                name={name}
                value={itemValue}
                checked={isChecked(itemValue)}
                onChange={onChange}
              />
            </div>
          ))}
        </>
      )}
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
  inputclass,
  required,
}) => {
  return (
    <div className={`${divclass ? divclass : 'w-full'} ${divclass?.includes('block') ? '' : 'flex items-center'}`}>
      <label
        htmlFor={name}
        className={`${labelclass} ${divclass?.includes('block') ? '' : 'mr-1'} ${
          labelclass?.includes('text') ? '' : 'text-lb lgMax:text-lm'
        }`}
      >
        {label}
      </label>
      <input
        required={required}
        type='text'
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`${inputclass} ${inputclass?.includes('w-') ? '' : 'w-full flex-1'} ${
          inputclass?.includes('px-') ? '' : 'px-1.5'
        } border border-slate-300 hover:border-aidam80 rounded-md transition-colors outline-none`}
      />
    </div>
  );
};
