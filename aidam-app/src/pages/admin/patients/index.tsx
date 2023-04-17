import React from 'react'
import Head from 'next/head'

import NavbarDesktop from '@/components/navbar/NavbarDesktop'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

const patients = () => {
  return (
    <>
      <Head>
        <title>AIDAM Admin - Pacientes</title>
      </Head>
      <NavbarDesktop />
      <main className='min-h-screen'>
        <div className='flex justify-end mt-7 w-full'>
          <div className='w-[70%] flex justify-between items-center mr-12'>
            <SearchBar />
            <Link href={'patients/create'} className='h-10 bg-aidam80 hover:bg-aidam70 transition-colors text-lb text-white font-semibold rounded-md p-4 flex items-center'>Nuevo paciente</Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default patients