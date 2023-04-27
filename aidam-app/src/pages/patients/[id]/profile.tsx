import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { hasCookie } from 'cookies-next';

import Data from '@/components/profile/Data';
import profileImage from '@/assets/icons/profileImage.svg';
import professionLogo from '@/assets/icons/professionLogo.svg';
import licenseIcon from '@/assets/icons/licenseIcon.svg';
import phoneIcon from '@/assets/icons/phoneIcon.svg';
import emailIcon from '@/assets/icons/emailIcon.svg';
import cardIcon from '@/assets/icons/cardIcon.svg';
import scheduleIcon from '@/assets/icons/scheduleIcon.svg';
import Navbar from '@/components/navbar/Navbar';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import { downloadCertificate, getOnePatient } from '@/services/patients';
import useMediaQuery from '@/hooks/useMediaQuery';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import ArrowBack from '@/components/ArrowBack';
import DotsMenu from '@/components/profile/patient/DotsMenu';
import { deletePatient } from '@/services/patients';
import Modal from '@/components/Modal';

const Profile = ({ query }: MyPageProps) => {
  const [birthDate, setBirthDate] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const router = useRouter()

  const patient = useQuery({
    queryKey: ['patient', query.id],
    enabled: hasCookie('session'),
    queryFn: () => getOnePatient(query.id),
  });

  const delPatient = useMutation({
    mutationFn: deletePatient,
    onSuccess: patient => {
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const handleDownload = async () => {
    const pathCertificate = await downloadCertificate(query.id);
    window.open(pathCertificate);
  }

  useEffect(() => {
    if (patient.data) {
      const date = new Date(patient.data.birth).toLocaleString().split(',')[0];
      setBirthDate(date);
    }
  }, [patient.isSuccess]);

  useEffect(() => {
    if(open === false && type === 1) router.push({pathname: '/patients'})
  }, [open])

  return (
    <>
      <Head>
        <title>{`AIDAM - Perfil de ${patient.data?.firstName} ${patient.data?.lastName}`}</title>
      </Head>
      <main className='flex flex-col items-center min-h-screen bg-background'>
        {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />}
        <div className='w-full lg:px-12 lg:mt-2.5'>
          <NavbarPatient />
          <div className='flex flex-col lgMax:px-3.5'>
            {!useMediaQuery(1024) && (
              <div className='flex justify-between items-center mt-8'>
                <ArrowBack />
                <div className='flex gap-12 relative z-0'>
                  <button onClick={handleDownload} className='text-lm font-medium text-white px-4 py-2.5 h-fit rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'>
                    Certificado
                  </button>
                  {patient.data && (
                    <DotsMenu
                      handleDelete={() => delPatient.mutate(patient.data._id)}
                      handleEdit={() => router.push({pathname: `/admin/patients/edit/${patient.data?._id}`})}
                    />
                  )}
                </div>
              </div>
            )}
            <div className='lgMax:my-8 mb-8 lg:mb-11 flex flex-col items-center'>
              <Image src={profileImage} alt='perfil' className='lg:w-[90px]' />
              <p className='font-semibold text-lb lg:text-xl1 lg:mt-3'>
                {patient.data?.firstName} {patient.data?.lastName}
              </p>
            </div>
            <div className='flex lgMax:flex-col'>
              {useMediaQuery(1024) && (
                <>
                  <div className='flex flex-col px-2.5 mb-4 lg:w-1/3'>
                    <div className='flex justify-between mb-4'>
                      <p className='font-semibold'>DIAGNÓSTICO</p>
                      <button onClick={handleDownload} className='text-xs font-normal text-white px-4 py-2.5 rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'>
                        Certificado
                      </button>
                    </div>
                    <div className='text-sm'>{patient.data?.diagnosis}</div>
                  </div>
                  <hr className='w-full border-black03 mb-5' />
                </>
              )}
              <div className='flex flex-col px-2.5 lg:w-1/3 lg:items-center'>
                <div className='w-fit'>
                  <h1 className='font-semibold mb-6 lg:text-xg'>
                    DATOS PERSONALES
                  </h1>
                  <Data
                    icon={professionLogo}
                    title={'Obra social'}
                    info={patient.data?.socialwork.toUpperCase()}
                  ></Data>
                  <Data
                    icon={licenseIcon}
                    title={'N° de afiliado'}
                    info={patient.data?.affiliateNumber}
                  ></Data>
                  <Data
                    icon={cardIcon}
                    title={'Módulo autorizado'}
                    info={patient.data?.authorizedModule}
                  ></Data>
                  <Data icon={cardIcon} title={'DNI'} info={'54688688'}></Data>
                  <Data
                    icon={scheduleIcon}
                    title={'Fecha de nacimiento'}
                    info={birthDate}
                  ></Data>
                </div>
              </div>
              {useMediaQuery(1024) && (
                <hr className='w-full border-black03 mb-5' />
              )}
                <div className='flex flex-col px-2.5 mb-4 lg:w-1/3 items-center lgMax:items-start lg:border-x border-black03'>
                  <h1 className='font-semibold mb-12 lgMax:mb-6 text-center lg:text-xg'>
                    PROFESIONALES
                  </h1>
                  <ul className='list-disc text-lg lgMax:text-lb font-normal lgMax:ml-4 '>
                    {patient.data?.professionalsId.map((prof, index) => (
                      <li key={index} className='mb-4'>
                        <Link
                          href={`/profile/${prof._id}`}
                          className='hover:text-aidam70 transition-colors font-semibold'
                        >
                          {prof.firstName} {prof.lastName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              <div className='flex flex-col px-2.5 mb-4 lg:w-1/3 lg:items-center'>
                <div className='w-fit'>
                  {!useMediaQuery(1024) && (
                    <>
                      <h1 className='font-semibold mb-[33px] text-xg'>
                        DIAGNÓSTICO
                      </h1>
                      <p className='text-lb mb-11'>{patient.data?.diagnosis}</p>
                    </>
                  )}
                  <h1 className='font-semibold mb-6 lg:mb-11 lg:text-xg'>
                    CONTACTO
                  </h1>
                  <Data
                    icon={emailIcon}
                    title={'Correo electrónico'}
                    info={patient.data?.email}
                  ></Data>
                  <Data
                    icon={phoneIcon}
                    title={'Teléfono'}
                    info={patient.data?.phone}
                  ></Data>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          type={type}
          errors={errors}
        >
          <h1>Paciente eliminado correctamente</h1>
        </Modal>
      </main>
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
