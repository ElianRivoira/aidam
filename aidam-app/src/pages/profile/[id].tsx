import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { hasCookie } from 'cookies-next';
import { useMutation, useQuery } from '@tanstack/react-query';

import useMediaQuery from '@/hooks/useMediaQuery';
// import Navbar from '@/components/navbar/Navbar';
// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import Data from '@/components/profile/Data';
import profileImage from '@/assets/icons/profileImage.svg';
import professionLogo from '@/assets/icons/professionLogo.svg';
import licenseIcon from '@/assets/icons/licenseIcon.svg';
import emailIcon from '@/assets/icons/emailIcon.svg';
import phoneIcon from '@/assets/icons/phoneIcon.svg';
import { findUserById, getLoggedUser } from '@/services/users';
import ArrowBack from '@/components/ArrowBack';
import Modal from '@/components/Modal';
import { deleteUser } from '@/services/users';
import Button from '@/components/Button';

const Profile = ({ query }: MyPageProps) => {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>();
  const [browserPatients, setbrowserPatients] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [pathImg, setPathImg] = useState('');
  const [cookieError, setCookieError] = useState(false);
  const router = useRouter();

  const user = useQuery({
    queryKey: ['user', query.id],
    enabled: hasCookie('session'),
    queryFn: () => findUserById(query.id),
  });

  const loggedUser = useQuery({
    queryKey: ['loggedUser'],
    queryFn: getLoggedUser,
    retry: 1,
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

  const deleteProfessional = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setSuccessMsg('¡El usuario ha sido dado de baja correctamente!');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const filter = (patientsArr: Patient[], letters: string) => {
    let filteredPatients: Patient[];
    if (letters === '') {
      setFilteredPatients(patientsArr.filter((patient: Patient) => patient.active));
      return;
    }
    if (letters.includes(' ')) {
      const [firstName, lastName] = letters.split(' ');
      filteredPatients = patientsArr.filter((patient: Patient) => {
        if (
          patient.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
          patient.lastName.toLowerCase().includes(lastName.toLowerCase()) &&
          patient.active
        )
          return true;
        else return false;
      });
    } else {
      filteredPatients = patientsArr.filter(
        (patient: Patient) =>
          (patient.firstName.toLowerCase().includes(letters.toLowerCase()) && patient.active) ||
          (patient.lastName.toLowerCase().includes(letters.toLowerCase()) && patient.active)
      );
    }
    setFilteredPatients(filteredPatients);
  };

  useEffect(() => {
    if (!open && type === 1) router.push('/admin/professionals');
    else if (!open && type === 2 && cookieError) router.push('/login');
  }, [open]);

  useEffect(() => {
    setFilteredPatients(user.data?.patientsId.filter(patient => patient.active));
    if (user.data?.profileImg) {
      const path = `http://${process.env.NEXT_PUBLIC_DOWNLOAD}/users/profileimg/${user.data.profileImg}`;
      setPathImg(path);
    } else {
      setPathImg('');
    }
  }, [user.isSuccess, user.isRefetching]);

  useEffect(() => {
    if (user.data) filter(user.data.patientsId, browserPatients);
  }, [browserPatients]);

  return (
    <>
      <Head>
        <title>{loggedUser.data?.admin ? 'AIDAM Admin - Perfil' : 'AIDAM - Perfil'}</title>
      </Head>
      <main className='flex flex-col items-center bg-background'>
        {useMediaQuery(1024) ? (
          <>
            {/* <Navbar /> */}
            <div className='px-3.5 w-full'>
              <div className='flex flex-col'>
                <div className={`flex ${loggedUser.data?.admin ? 'justify-between' : 'justify-end'} mt-4`}>
                  {loggedUser.data?.admin && <ArrowBack route='/admin/professionals' />}
                  <Link
                    href={`/profile/edit/${user.data?._id}`}
                    className='self-end text-xs font-normal text-white px-4 py-2.5 mr-1 h-fit rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                  >
                    Editar
                  </Link>
                </div>
                <div className='flex flex-col items-center mx-auto'>
                  <div className='rounded-full w-[90px] h-[90px] overflow-hidden mb-2'>
                    {pathImg ? (
                      <img src={pathImg} alt='imagen' className='' />
                    ) : (
                      <Image src={profileImage} alt='imagen' className='w-full' />
                    )}
                  </div>
                  <p className='font-semibold text-lb'>
                    {user.data?.firstName.toUpperCase()} {user.data?.lastName.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className='mt-12 px-2.5'>
                <h1 className='font-semibold text-lb mb-5.5'>DATOS PERSONALES</h1>
                <Data icon={professionLogo} title='Profesión' info={user.data?.profession} />
                <Data icon={licenseIcon} title='Matrícula' info={user.data?.license} />
              </div>
              <hr className='w-full border-black03' />

              <div className='flex flex-col mt-8 px-2.5 w-full'>
                <h1 className='mb-5.5 font-semibold text-lb'>PACIENTES</h1>

                <div className='self-start flex-1 w-full'>
                  <input
                    placeholder='Buscar paciente'
                    className='max-w-[250px] outline-none border border-black03 rounded-md px-2 py-1 hover:border-aidam focus:border-aidam mb-4 transition-colors font-normal'
                    onChange={e => setbrowserPatients(e.target.value)}
                    value={browserPatients}
                  />
                  <div className='mb-4 overflow-y-auto'>
                    {filteredPatients?.map((patient, index) => (
                      <li key={index} className='mb-4 hover:text-aidam70 transition-colors'>
                        <Link href={`/patients/${patient._id}/profile`}>
                          {patient.lastName} {patient.firstName}
                        </Link>
                      </li>
                    ))}
                  </div>
                </div>
              </div>
              <hr className='w-full border-black03' />
              <div className='mt-8 px-2.5'>
                <h1 className='font-semibold text-lb mb-5.5'>CONTACTO</h1>
                <Data icon={emailIcon} title='Correo electrónico' info={user.data?.email} />
                <Data icon={phoneIcon} title='Teléfono' info={user.data?.phone} />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* <NavbarDesktop /> */}
            <div className='w-full px-12'>
              <div className={`flex mt-9 ${loggedUser.data?.admin ? 'justify-between' : 'justify-end'} items-center`}>
                {loggedUser.data?.admin && <ArrowBack route='/admin/professionals' />}
                <div className='flex gap-4'>
                  <Link
                    className='flex items-center text-lb font-semibold text-white h-10 p-4 rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                    href={`/profile/edit/${user.data?._id}`}
                  >
                    Editar
                  </Link>

                  {loggedUser.data?.admin && (
                    <Button
                      onClick={() => {
                        setOpen(true);
                        setType(4);
                      }}
                      text='Dar de baja'
                    />
                  )}
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='rounded-full w-[110px] h-[110px] overflow-hidden mb-2'>
                  {pathImg ? (
                    <img src={pathImg} alt='imagen' className='' />
                  ) : (
                    <Image src={profileImage} alt='imagen' className='w-full' />
                  )}
                </div>
                <p className='font-semibold text-2xl'>
                  {user.data?.firstName.toUpperCase()} {user.data?.lastName.toUpperCase()}
                </p>
              </div>
              <div className='flex mt-14'>
                <div className='font-semibold text-xl w-1/3 flex justify-center'>
                  <div className='w-fit flex flex-col'>
                    <h1 className='mb-10'>DATOS PERSONALES</h1>
                    <div>
                      <Data icon={professionLogo} title='Profesión' info={user.data?.profession} />
                      <Data icon={licenseIcon} title='Matrícula' info={user.data?.license} />
                    </div>
                  </div>
                </div>
                <div className='flex justify-center border-x border-black03 w-1/3 items-center'>
                  <div className='w-[80%] flex flex-col'>
                    <h1 className='mb-10 font-semibold text-xl text-center'>PACIENTES</h1>
                    <input
                      placeholder='Buscar paciente'
                      className='self-center text-ln outline-none border border-black03 rounded-md w-[70%] px-2 py-1 hover:border-aidam focus:border-aidam mb-4 transition-colors'
                      onChange={e => setbrowserPatients(e.target.value)}
                      value={browserPatients}
                    />
                    <div className='h-48 overflow-y-auto'>
                      {filteredPatients?.map((patient, index) => (
                        <li key={index} className='mb-4 hover:text-aidam70 transition-colors font-semibold text-ln'>
                          <Link href={`/patients/${patient._id}/profile`}>
                            {patient.firstName} {patient.lastName}
                          </Link>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex justify-center font-semibold text-xl w-1/3'>
                  <div className='flex flex-col w-fit'>
                    <h1 className='mb-10'>CONTACTO</h1>
                    <div>
                      <Data icon={emailIcon} title='Correo electrónico' info={user.data?.email} />
                      <Data icon={phoneIcon} title='Teléfono' info={user.data?.phone} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        deleteFunc={() => deleteProfessional.mutate(query.id)}
        errors={errors}
        deleteMessage={'¿Está seguro que desea dar de baja el usuario?'}
      >
        <h1>{successMsg}</h1>
      </Modal>
    </>
  );
};

export default Profile;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

Profile.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
