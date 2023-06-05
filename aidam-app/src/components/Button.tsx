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
      className={`flex w-fit items-center justify-center text-center lg:text-lm text-sm p-3 py-2 min-w-[100px] sm:py-2 font-medium text-white rounded-md bg-aidam80 hover:bg-aidam70 active:shadow-active transition-colors ${classname}`}
    >
      {text}
    </button>
  );
};

export default Button;
