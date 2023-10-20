import React from 'react';
import x from '../../assets/icons/x.svg';
import ok from '../../assets/icons/ok.svg';
import Image from 'next/image';
import { registerUser, deleteUser } from '@/services/users';

interface Props {
  closeModal: () => void;
  refreshRender: () => void;
  inactiveUsers: User[];
}

const ProfessionalsModal: React.FC<Props> = ({
  closeModal,
  refreshRender,
  inactiveUsers,
}) => {
  const handleRegisterUser = async (userId: string) => {
    await registerUser(userId);
    refreshRender();
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    refreshRender();
  };

  return (
    <div className='fixed z-50 inset-0 overflow-y-auto' onClick={closeModal}>
      <div className='flex items-center justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-black opacity-75'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
        <div className='fixed top-2/4 lgMax:left-3 lgMax:right-3 lg:left-2/4 min-h-[20%] p-3 -translate-y-2/4 lg:-translate-x-2/4 bg-background rounded-xl text-left overflow-hidden shadow-xl transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='text-center text-3xl font-bold md:mt-6 mt-10'>
            PROFESIONALES
          </div>
          <button
            type='button'
            className='absolute top-3 right-3 rounded-md pl-4 py-2 text-black text-3xl font-medium hover:text-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={closeModal}
          >
            <Image src={x} alt='x' />
          </button>
          <div className='flex flex-col px-4 mt-7 mb-4'>
            {inactiveUsers.length ? (
              inactiveUsers.map((user) => (
                <div key={user._id} className='flex justify-between mb-2 px-4 py-6 rounded-2xl bg-white border drop-shadow-xl'>
                  <div className='md:ml-4'>
                    {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}{' '}
                  </div>
                  <div className='flex pl-4 md:pl-0'>
                    <button
                      className='mr-6'
                      onClick={() => handleRegisterUser(user._id)}
                    >
                      <Image src={ok} alt=':)' />
                    </button>
                    <button onClick={() => handleDeleteUser(user._id)}>
                      <Image src={x} alt='x' />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <h3 className='text-center'>No hay usuarios para dar de alta.</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsModal;
