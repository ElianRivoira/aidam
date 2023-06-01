import React from 'react';

interface Props {
  width?: number;
  height?: number;
  fill?: string;
}

const LogoutAidam: React.FC<Props> = ({ width, height, fill }) => {
  return (
    <>
      <svg
        width={width ? width : '24'}
        height={height ? height : '24'}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M19.5 21H8C7.44772 21 7 20.5523 7 20V4C7 3.44772 7.44772 3 8 3H19.5C20.0523 3 20.5 3.44772 20.5 4V5.25C20.5 5.66421 20.1642 6 19.75 6C19.3358 6 19 5.66421 19 5.25V4.5H8.5V19.5H19V18C19 17.5858 19.3358 17.25 19.75 17.25C20.1642 17.25 20.5 17.5858 20.5 18V19.5V20C20.5 20.5523 20.0523 21 19.5 21Z'
          fill={fill ? fill : 'black'}
        />
        <path
          d='M17.534 7.96321L20.5984 11.1837C20.826 11.4339 20.826 11.8161 20.5984 12.0663L17.534 15.2868C17.2943 15.5388 16.8924 15.5388 16.6526 15.2868C16.4291 15.0519 16.4291 14.683 16.6526 14.4481L18.7546 12.239H12.614C12.2749 12.239 12 11.9641 12 11.625C12 11.2859 12.2749 11.011 12.614 11.011H18.7546L16.6526 8.80193C16.4291 8.56703 16.4291 8.19811 16.6526 7.96321C16.8924 7.7112 17.2943 7.7112 17.534 7.96321Z'
          fill={fill ? fill : 'black'}
        />
      </svg>
    </>
  );
};

export default LogoutAidam;