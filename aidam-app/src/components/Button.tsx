import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  text: string;
  type?: 'submit' | 'reset' | 'button';
  classname?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, type, classname }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`flex w-fit items-center text-lm lgMax:text-sm font-medium lgMax:font-normal p-2.5 text-white rounded-md bg-aidam80 hover:bg-aidam70 active:shadow-active transition-colors ${classname}`}
    >
      {text}
    </button>
  );
};

export default Button;
