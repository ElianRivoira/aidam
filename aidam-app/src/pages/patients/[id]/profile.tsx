import React, { useEffect, useState } from 'react';
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
// import Navbar from '@/components/navbar/Navbar';
// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import { deleteCertificate, getOnePatient } from '@/services/patients';
import useMediaQuery from '@/hooks/useMediaQuery';
import ArrowBack from '@/components/ArrowBack';
import DotsMenu from '@/components/profile/patient/DotsMenu';
import { deletePatient } from '@/services/patients';
import Modal from '@/components/Modal';
import PickCertificateModal from '@/components/profile/patient/PickCertificateModal';
import { getLoggedUser } from '@/services/users';
import { handleDownloadCertificate } from '@/utils/handleDownload';
import Button from '@/components/Button';

const Profile = ({ query }: MyPageProps) => {
  const [birthDate, setBirthDate] = useState('');
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [openCertModal, setOpenCertModal] = useState(false);
  const [typeCertModal, setTypeCertModal] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [cookieError, setCookieError] = useState(false);

  const router = useRouter();

  const patient = useQuery({
    queryKey: ['patient', query.id],
    enabled: hasCookie('session'),
    keepPreviousData: true,
    queryFn: () => getOnePatient(query.id),
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

  const delPatient = useMutation({
    mutationFn: deletePatient,
    onSuccess: patient => {
      setSuccessMsg('Paciente eliminado correctamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const delCert = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      setSuccessMsg('Certificado eliminado correctamente');
      setTypeCertModal(1);
      setOpenCertModal(true);
      patient.refetch();
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  useEffect(() => {
    if (patient.data) {
      const date = new Date(patient.data.birth).toLocaleString('es-ES').split(',')[0];
      setBirthDate(date);
    }
  }, [patient.data]);

  useEffect(() => {
    if (!open && type === 1) router.push({ pathname: '/patients' });
    else if (!open && type === 2 && cookieError) router.push({ pathname: '/login' });
  }, [open]);

  return (
    <>
      <Head>
        <title>
          {loggedUser.data?.admin
            ? `AIDAM Admin - Perfil de ${patient.data?.firstName} ${patient.data?.lastName}`
            : `AIDAM - Perfil de ${patient.data?.firstName} ${patient.data?.lastName}`}
        </title>
      </Head>
      <main className='flex flex-col items-center min-h-screen bg-background'>
        {/* {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />} */}
        <div className='w-full lg:px-12 lg:mt-2.5'>
          <NavbarPatient />
          <div className='flex flex-col lgMax:px-3.5'>
            <div className='flex justify-between items-center mt-5 lg:mt-8'>
              <ArrowBack route='/patients' />
              <div className='flex gap-12 relative z-0'>
                {!useMediaQuery(1024) && <Button onClick={() => setOpenCertificateModal(true)} text='Certificado' />}
                {patient.data && loggedUser.data?.admin ? (
                  <DotsMenu
                    handleDelete={() => {
                      setType(4);
                      setOpen(true);
                    }}
                    handleEdit={() =>
                      router.push({
                        pathname: `/admin/patients/edit/${patient.data._id}`,
                      })
                    }
                  />
                ) : null}
              </div>
            </div>

            {/* <div className='lgMax:mt-5 flex justify-between'>
              {useMediaQuery(1024) && (
                <ArrowBack route='/patients' width={33} />
              )}
            </div> */}
            <div className='lgMax:mb-8 lg:mb-11 flex w-full'>
              <div className='flex flex-col mx-auto items-center'>
                <Image src={profileImage} alt='perfil' className='lg:w-[90px]' />
                <p className='font-semibold text-lb lg:text-xl1 lg:mt-3'>
                  {patient.data?.firstName} {patient.data?.lastName}
                </p>
              </div>
            </div>
            <div className='flex lgMax:flex-col'>
              {useMediaQuery(1024) && (
                <>
                  <div className='flex flex-col px-2.5 mb-4 lg:w-1/3'>
                    <div className='flex justify-between items-center mb-4'>
                      <p className='font-semibold'>DIAGNÓSTICO</p>
                      <Button onClick={() => setOpenCertificateModal(true)} text='Certificado' />
                    </div>
                    <div className='text-sm'>{patient.data?.diagnosis}</div>
                  </div>
                  <hr className='w-full border-black03 mb-5' />
                </>
              )}
              <div className='flex flex-col px-2.5 lg:w-1/3 lg:items-center'>
                <div className='w-fit'>
                  <h1 className='font-semibold lg:mb-11 mb-6 lg:text-xg'>DATOS PERSONALES</h1>
                  <Data
                    icon={professionLogo}
                    title={'Obra social'}
                    info={patient.data?.socialwork.toUpperCase()}
                  ></Data>
                  <Data icon={licenseIcon} title={'N° de afiliado'} info={patient.data?.affiliateNumber}></Data>
                  <Data icon={cardIcon} title={'Módulo autorizado'} info={patient.data?.authorizedModule}></Data>
                  <Data icon={cardIcon} title={'DNI'} info={'54688688'}></Data>
                  <Data icon={scheduleIcon} title={'Fecha de nacimiento'} info={birthDate}></Data>
                  <Data icon={scheduleIcon} title={'Dirección'} info={patient.data?.adress}></Data>
                  <Data icon={scheduleIcon} title={'CUD'} info={patient.data?.cud}></Data>
                </div>
              </div>
              {useMediaQuery(1024) && <hr className='w-full border-black03 mb-5' />}
              <div className='flex justify-center lgMax:px-2.5 lgMax:mb-1 lg:w-1/3 lg:border-x border-black03'>
                <div className='w-full lg:w-[80%] flex flex-col'>
                  <h1 className='font-semibold mb-11 lgMax:mb-6 lg:text-center lg:text-xg'>PROFESIONALES</h1>
                  <div>
                    {patient.data?.professionalsId.map((prof, index) => (
                      <li
                        key={index}
                        className='mb-4 lgMax:ml-4 text-ln lgMax:text-lb hover:text-aidam70 transition-colors font-semibold'
                      >
                        <Link href={`/profile/${prof._id}`} className=''>
                          {prof.firstName} {prof.lastName}
                        </Link>
                      </li>
                    ))}
                  </div>
                </div>
              </div>
              {useMediaQuery(1024) && <hr className='w-full border-black03 mb-5' />}
              <div className='flex flex-col px-2.5 mb-4 lg:w-1/3 lg:items-center'>
                <div className='w-fit'>
                  {!useMediaQuery(1024) && (
                    <>
                      <h1 className='font-semibold mb-11 text-xg'>DIAGNÓSTICO</h1>
                      <p className='text-lb mb-11'>{patient.data?.diagnosis}</p>
                    </>
                  )}
                  <h1 className='font-semibold mb-6 lg:mb-11 lg:text-xg'>CONTACTO</h1>
                  <Data icon={emailIcon} title={'Correo electrónico'} info={patient.data?.email}></Data>
                  <Data icon={phoneIcon} title={'Teléfono'} info={patient.data?.phone}></Data>
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
          deleteFunc={() => {
            patient.data && delPatient.mutate(patient.data?._id);
          }}
          deleteMessage='¿Está seguro que desea dar de baja al paciente?'
        >
          <h1>{successMsg}</h1>
        </Modal>
        <PickCertificateModal
          open={openCertificateModal}
          openCertModal={openCertModal}
          setOpenCertModal={setOpenCertModal}
          typeCertModal={typeCertModal}
          setTypeCertModal={setTypeCertModal}
          onClose={() => setOpenCertificateModal(false)}
          patient={patient.data}
          handleDownload={handleDownloadCertificate}
          admin={loggedUser.data?.admin}
          delCert={delCert}
        />
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

Profile.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
