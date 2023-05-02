import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { NextPageContext } from 'next';
import { useQuery } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';

import useMediaQuery from '@/hooks/useMediaQuery';
import Navbar from '@/components/navbar/Navbar';
import Data from '@/components/profile/Data';
import profileEdit from '@/assets/icons/profileEdit.svg';
import profileImage from '@/assets/icons/profileImage.svg';
import professionLogo from '@/assets/icons/professionLogo.svg';
import licenseIcon from '@/assets/icons/licenseIcon.svg';
import emailIcon from '@/assets/icons/emailIcon.svg';
import phoneIcon from '@/assets/icons/phoneIcon.svg';
import { useMutation, useQuery } from '@tanstack/react-query';
import { findUserById } from '@/services/users';
import { hasCookie } from 'cookies-next';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import { NextPageContext } from 'next';
import ArrowBack from '@/components/ArrowBack';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { deleteUser } from '@/services/users';
import { useRouter } from 'next/router';


const Profile = ({ query }: MyPageProps) => {
  const user = useQuery({
    queryKey: ['user', query.id],
    enabled: hasCookie('session'),
    queryFn: () => findUserById(query.id),
  });

  const [filteredPatients, setFilteredPatients] = useState<Patient[]>();
  const [browserPatients, setbrowserPatients] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const filter = (patientsArr: Patient[], letters: string) => {
    let filteredPatients: Patient[];
    if (letters === '') {
      setFilteredPatients(patientsArr);
      return;
    }
    if (letters.includes(' ')) {
      const [firstName, lastName] = letters.split(' ');
      filteredPatients = patientsArr.filter((patient: Patient) => {
        if (
          patient.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
          patient.lastName.toLowerCase().includes(lastName.toLowerCase())
        )
          return true;
        else return false;
      });
    } else {
      filteredPatients = patientsArr.filter(
        (patient: Patient) =>
          patient.firstName.toLowerCase().includes(letters.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(letters.toLowerCase())
      );
    }
    setFilteredPatients(filteredPatients);
  };

  const router = useRouter();

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

  useEffect(() => {
    if (!open && type === 1) {
      router.push('/admin/professionals');
    }
  }, [open]);

  useEffect(() => {
    setFilteredPatients(user.data?.patientsId);
  }, [user.isSuccess]);

  useEffect(() => {
    if (user.data) filter(user.data.patientsId, browserPatients);
  }, [browserPatients]);

  return (
    <>
      <Head>
        <title>AIDAM {user.data?.admin ? 'Admin' : ''} - Perfil</title>
      </Head>
      <div className='min-h-screen flex flex-col items-center'>
        {useMediaQuery(1024) ? (
          <>
            <Navbar />
            <div className='px-3.5 w-full max-w-md md:border md:shadow-xg md:rounded-3xl md:mt-5'>
              <div className='flex justify-between mt-3'>
                <ArrowBack />
                <Link href={`/profile/edit/${user.data?._id}`} className='font-light text-xm flex flex-col items-center'>
                  <Image
                    src={profileEdit}
                    alt='editar perfil'
                    width={25}
                    height={25}
                    className='-mb-3'
                  />
                  <br />
                  Editar perfil
                </Link>
              </div>
              <div className='flex flex-col items-center'>
                <Image src={profileImage} alt='imagen' className='' />
                <p className='font-semibold text-lb'>
                  {user.data?.firstName.toUpperCase()}{' '}
                  {user.data?.lastName.toUpperCase()}
                </p>
              </div>
              <div className='mt-12 px-2.5'>
                <h1 className='font-semibold text-lb mb-5.5'>
                  DATOS PERSONALES
                </h1>
                <Data
                  icon={professionLogo}
                  title='Profesión'
                  info={user.data?.profession}
                />
                <Data
                  icon={licenseIcon}
                  title='Matrícula'
                  info={user.data?.license}
                />
                <div className='mb-4 overflow-y-auto'>
                  <h1 className='font-semibold text-lb mb-4'>PACIENTES</h1>
                  {filteredPatients?.map((patient, index) => (
                    <li
                      key={index}
                      className='text-sm lg:text-lb font-semibold mb-2 hover:text-aidam'
                    >
                      <Link href={`/patients/${patient._id}/profile`}>
                        {patient.firstName} {patient.lastName}
                      </Link>
                    </li>
                  ))}
                </div>
              </div>
              <hr className='w-full border-black03' />
              <div className='flex flex-col font-semibold text-lb mt-8 px-2.5 w-full'>
                  <h1 className='mb-5.5'>PACIENTES</h1>
                  <div className='self-start flex-1 w-full'>
                    <input
                      placeholder='Buscar paciente'
                      className='max-w-[250px] outline-none border border-black03 rounded-md px-2 py-1 hover:border-aidam focus:border-aidam mb-4 transition-colors font-normal'
                      onChange={e => setbrowserPatients(e.target.value)}
                      value={browserPatients}
                    />
                    <div className='mb-8 overflow-y-auto'>
                      {filteredPatients?.map((patient, index) => (
                        <li key={index}>
                          <Link href={`/patients/${patient._id}/profile`}>
                            {patient.firstName} {patient.lastName}
                          </Link>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
              <hr className='w-full border-black03' />
              <div className='mt-8 px-2.5'>
                <h1 className='font-semibold text-lb mb-5.5'>CONTACTO</h1>
                <Data
                  icon={emailIcon}
                  title='Correo electrónico'
                  info={user.data?.email}
                />
                <Data
                  icon={phoneIcon}
                  title='Teléfono'
                  info={user.data?.phone}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <NavbarDesktop />
            <div className='w-full px-12'>
              <div className='flex mt-9 justify-between'>
                <div>
                  <ArrowBack />
                </div>
                <div className='flex gap-4'>
                  <Link
                    className='flex items-center text-lb font-semibold text-white px-4 py-2.5 rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                    href={`/profile/edit/${user.data?._id}`}
                  >
                    Editar
                  </Link>
                  {user.data?.admin && (
                     <button
                    onClick={() => {
                      setOpen(true);
                      setType(4);
                    }}
                    className='text-lb font-semibold text-white px-4 py-2.5 rounded-md bg-[#B81212CC] hover:bg-[#e26f6fcc] transition-colors'
                  >
                    Dar de baja
                  </button>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <Image src={profileImage} alt='perfil' className='w-[90px]' />
                <p className='font-semibold text-2xl'>
                  {user.data?.firstName.toUpperCase()}{' '}
                  {user.data?.lastName.toUpperCase()}
                </p>
              </div>
              <div className='flex mt-14'>
                <div className='flex flex-col font-semibold text-xl pl-20 w-1/3'>
                  <h1 className='mb-10'>DATOS PERSONALES</h1>
                  <div>
                    <Data
                      icon={professionLogo}
                      title='Profesión'
                      info={user.data?.profession}
                    />
                    <Data
                      icon={licenseIcon}
                      title='Matrícula'
                      info={user.data?.license}
                    />
                  </div>
                </div>
                <div className='flex flex-col font-semibold border-x-2 text-xl w-1/3 items-center'>
                  <h1 className='mb-10'>PACIENTES</h1>
                  <div className='self-start px-12 flex-1 w-full'>
                    <input
                      placeholder='Buscar paciente'
                      className='max-w-[250px] outline-none border border-black03 rounded-md px-2 hover:border-aidam focus:border-aidam mb-4 transition-colors'
                      onChange={e => setbrowserPatients(e.target.value)}

                      value={browserPatients}
                    />
                    <div className='h-48 overflow-y-auto'>
                      {filteredPatients?.map((patient, index) => (
                        <li key={index}>
                          <Link href={`/patients/${patient._id}/profile`}>
                            {patient.firstName} {patient.lastName}
                          </Link>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col font-semibold text-xl pl-20 w-1/3'>
                  <h1 className='mb-10'>CONTACTO</h1>
                  <div>
                    <Data
                      icon={emailIcon}
                      title='Correo electrónico'
                      info={user.data?.email}
                    />
                    <Data
                      icon={phoneIcon}
                      title='Teléfono'
                      info={user.data?.phone}
                    />
                  </div>
                </div>
              </div>
            </div>
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
        )}
      </div>
    </>
  );
};

export default Profile;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

Profile.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
