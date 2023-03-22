import Image from 'next/image';
import React from 'react'

interface DataProps {
  icon: any;
  title: string;
  info: string | number | undefined;
}

const Data: React.FC<DataProps> = ({icon, title, info}) => {
  return (
    <div className='flex mb-8'>
      <div className='flex flex-col items-start mr-1.5'>
        <Image src={icon} alt='icon' />
      </div>
      <div className='flex flex-col'>
        <h2 className='text-sm font-semibold mb-2'>{title}</h2>
        <p className='text-sm font-normal'>{info}</p>
      </div>
    </div>
  )
}

export default Data