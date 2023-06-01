import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
// import Navbar from '@/components/navbar/Navbar';
import SearchBar from '@/components/SearchBar';
import DesktopCard from '@/components/DesktopCard';
import { getAllUsers } from '@/services/users';
import ProfessionalsModal from '@/components/admin/ProfessionalsModal';
import Modal from '@/components/Modal';
import useMediaQuery from '@/hooks/useMediaQuery';
import MobileUsersCard from '@/components/MobileUsersCard';
import Button from '@/components/Button';

const professionals = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>();
  const [inactiveUsers, setInactiveUsers] = useState<User[]>();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const router = useRouter();

  function toggleModal() {
    setOpenModal(!openModal);
  }

  const users = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    retry: 1,
    onSuccess: (data) => {
      const activeUsrs = data.filter((user) => user.status === true);
      const inactiveUsrs = data.filter((user) => user.status === false);
      setActiveUsers(activeUsrs);
      setInactiveUsers(inactiveUsrs);
    },
    onError: (error) => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
    },
  });

  return (
    <>
      <Head>
        <title>AIDAM Admin - Profesionales</title>
      </Head>
      <main className='min-h-screen bg-background'>
        {useMediaQuery(1024) ? (
          <>
            {/* <Navbar /> */}
            <div className='p-2 px-3.5 flex justify-between w-full'>
              <SearchBar
                search={search}
                setSearch={setSearch}
                setActiveUsers={setActiveUsers}
              />
              <Button
                onClick={toggleModal}
                text='Dar de alta'
                classname='px-3 h-10 ml-2'
              />
            </div>
          </>
        ) : (
          <>
            {/* <NavbarDesktop />{' '} */}
            <div className='flex justify-end mt-7 w-full mb-14'>
              <div className='w-[70%] flex justify-between items-center mr-12'>
                <SearchBar
                  search={search}
                  setSearch={setSearch}
                  setActiveUsers={setActiveUsers}
                />
                <Button
                  onClick={toggleModal}
                  text='Dar de alta'
                  classname='px-4 h-10'
                />
              </div>
            </div>
          </>
        )}

        {useMediaQuery(1024) ? (
          <div className='mx-3.5'>
            {activeUsers?.map((user, index) => {
              if (!user.admin)
                return <MobileUsersCard user={user} key={index} />;
              else return null;
            })}
          </div>
        ) : (
          <div className='mx-12'>
            {activeUsers?.map((user, index) => {
              if (!user.admin) return <DesktopCard user={user} key={index} />;
              else return null;
            })}
          </div>
        )}

        {openModal && (
          <ProfessionalsModal
            refreshRender={() => users.refetch()}
            closeModal={toggleModal}
            inactiveUsers={inactiveUsers ?? []}
          />
        )}
        <Modal
          open={open}
          onClose={() => router.push('/login')}
          type={type}
          errors={errors}
        >
          <h1></h1>
        </Modal>
      </main>
    </>
  );
};

export default professionals;
