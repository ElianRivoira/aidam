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
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-6 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
        <div className='inline-block align-bottom bg-[#FCFCFC] rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='text-center text-3xl font-bold mt-6'>
            PROFESIONALES
          </div>
          <button
            type='button'
            className='absolute top-0 right-0 mt-3 mr-3 rounded-md pl-4 py-2 text-black text-3xl font-medium hover:text-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={closeModal}
          >
            <Image src={x} alt='x' />
          </button>
          <div className='flex flex-col px-4 mt-7 mb-4'>
            {inactiveUsers.length
              ? inactiveUsers.map((user) => (
                  <div className='flex justify-between mb-2 px-4 py-6 rounded-2xl bg-white border drop-shadow-xl'>
                    <div className='ml-4'>
                      {user.firstName.toUpperCase()}{' '}
                      {user.lastName.toUpperCase()}{' '}
                    </div>
                    <div className='flex'>
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
              : <h3 className='text-center'>No hay usuarios para dar de alta.</h3>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsModal;
