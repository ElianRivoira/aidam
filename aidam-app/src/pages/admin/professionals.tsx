import React, { useEffect, useState } from 'react';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import SearchBar from '@/components/SearchBar';
import DesktopCard from '@/components/DesktopCard';
import Head from 'next/head';
import { getAllUsers } from '@/services/users';
import ProfessionalsModal from '@/components/admin/ProfessionalsModal';

const professionals = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>();
  const [inactiveUsers, setInactiveUsers] = useState<User[]>();
  const [openModal, setOpenModal] = useState(false);

  function toggleModal() {
    setOpenModal(!openModal);
  }
  async function getUsers() {
    const users = await getAllUsers();
    let activeUsers;
    let inactiveUsers;
    activeUsers = users.filter(user => user.status === true);
    inactiveUsers = users.filter(user => user.status === false);
    setActiveUsers(activeUsers);
    setInactiveUsers(inactiveUsers);
  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Head>
        <title>AIDAM Admin - Profesionales</title>
      </Head>
      <NavbarDesktop />
      <main className='min-h-screen'>
        <div className='flex justify-end mt-7 w-full mb-14'>
          <div className='w-[70%] flex justify-between items-center mr-12'>
            <SearchBar />
            <button
              onClick={toggleModal}
              className='h-10 bg-aidam80 hover:bg-aidam70 transition-colors text-lb text-white font-semibold rounded-md p-4 flex items-center'
            >
              Dar de alta
            </button>
          </div>
        </div>
        <div className='mx-12'>
          {activeUsers?.map(user => (
            <DesktopCard user={user} />
          ))}
        </div>
        {openModal && (
          <ProfessionalsModal
            refreshRender={getUsers}
            closeModal={toggleModal}
            inactiveUsers={inactiveUsers ?? []}
          />
        )}
      </main>
    </>
  );
};

export default professionals;
