import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import arrowLeft from '@/assets/icons/arrowLeft.svg';

interface ArrowProps {
  width?: number;
}

const ArrowBack: React.FC<ArrowProps> = ({ width }) => {
  const router = useRouter();

  return (
    <button className='h-fit' onClick={() => router.back()}>
      <Image src={arrowLeft} alt='back' width={width ? width : 40} />
    </button>
  );
};

export default ArrowBack;
