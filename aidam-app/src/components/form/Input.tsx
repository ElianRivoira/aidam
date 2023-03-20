import React from 'react'

interface inputProps {
  label: string;
  type: string;
}

const Input: React.FC<inputProps> = ({label, type}) => {
  return (
    <div className='w-full'>
      <label htmlFor={label} className='text-sm font-normal mb-1'>{label}</label>
      <input type={type} className='w-full h-10 rounded-md border border-black02 mb-2.5 px-1.5' />
    </div>
  )
}

export default Input