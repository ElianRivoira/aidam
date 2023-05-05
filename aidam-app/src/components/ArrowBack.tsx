import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import arrowLeft from '@/assets/icons/arrowLeft.svg';

interface ArrowProps {
  width?: number;
  route: string;
}

const ArrowBack: React.FC<ArrowProps> = ({ width, route }) => {
  const router = useRouter();

  return (
    <button
      className='h-fit'
      onClick={() =>
        router.push({
          pathname: route,
        })
      }
    >
      <Image src={arrowLeft} alt='back' width={width ? width : 40} />
    </button>
  );
};

export default ArrowBack;
