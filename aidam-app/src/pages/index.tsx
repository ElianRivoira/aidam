import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCookies, hasCookie } from 'cookies-next'

import { AppDispatch, RootState } from '@/store';
import { fetchUser } from '@/store/slices/userSlice';

const index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(getCookies())
  
    return () => {
      
    }
  }, [])
  
  return (
    <div>index</div>
  )
}

export default index