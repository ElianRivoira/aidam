import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useMutation, useQuery } from '@tanstack/react-query';

// import SearchBar from '@/components/SearchBar';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import useMediaQuery from '@/hooks/useMediaQuery';
import {
  deleteMedicalReport,
  deleteSocialReport,
  getOnePatient,
  uploadMedicalReport,
  uploadSocialReport,
} from '@/services/patients';
import ReportItem from '@/components/profile/patient/ReportItem';
import UploadReportModal from '@/components/profile/patient/UploadReportModal';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import { getLoggedUser } from '@/services/users';

const medicSocial = ({ query }: MyPageProps) => {
  const [cookieError, setCookieError] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  // const [searchMedicals, setSearchMedicals] = useState('');
  // const [searchSocials, setSearchSocials] = useState('');
  const [openReportModal, setOpenReportModal] = useState(false);
  const [newReport, setNewReport] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [fileNameToDelete, setFileNameToDelete] = useState('');
  const [reportType, setReportType] = useState('');
  const [medicalReports, setMedicalReports] = useState<string[]>([]);
  const [socialReports, setSocialReports] = useState<string[]>([]);
  const router = useRouter();

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

  const patient = useQuery({
    queryKey: ['patient', query.id],
    keepPreviousData: true,
    queryFn: () => getOnePatient(query.id),
    retry: 1,
    refetchOnWindowFocus: false,
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
    onSuccess: patient => {
      setMedicalReports(patient.medicalReports);
      setSocialReports(patient.socialReports);
    },
  });

  const uploadSoc = useMutation({
    mutationFn: uploadSocialReport,
    onSuccess: editedPatient => {
      setSuccessMsg('Informe social cargado correctamente');
      onCloseReportModal();
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const uploadMed = useMutation({
    mutationFn: uploadMedicalReport,
    onSuccess: editedPatient => {
      setSuccessMsg('Informe médico cargado correctamente');
      onCloseReportModal();
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const delMedicalReport = useMutation({
    mutationFn: deleteMedicalReport,
    onSuccess: () => {
      setSuccessMsg('Informe médico eliminado correctamente');
      setType(1);
      setOpen(true);
      patient.refetch();
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const delSocialReport = useMutation({
    mutationFn: deleteSocialReport,
    onSuccess: () => {
      setSuccessMsg('Informe social eliminado correctamente');
      setType(1);
      setOpen(true);
      patient.refetch();
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const onCloseReportModal = () => {
    setOpenReportModal(false);
    setNewReport(null);
  };

  // const setSearchedReports = (search: string, reportsType?: string) => {
  //   if (patient.data) {
  //     let searchedReports: string[] = [];
  //     if (search.length) {
  //       if (reportsType === 'medical') {
  //         searchedReports = patient.data.medicalReports.filter(report => {
  //           return report.toLowerCase().includes(search.toLowerCase());
  //         });
  //       } else if (reportsType === 'social') {
  //         searchedReports = patient.data.socialReports.filter(report => {
  //           return report.toLowerCase().includes(search.toLowerCase());
  //         });
  //       }
  //     }
  //     if (searchedReports.length) {
  //       reportsType === 'medical' && setMedicalReports(searchedReports);
  //       reportsType === 'social' && setSocialReports(searchedReports);
  //     } else {
  //       reportsType === 'medical' && setMedicalReports(patient.data.medicalReports);
  //       reportsType === 'social' && setSocialReports(patient.data.socialReports);
  //     }
  //   }
  // };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setNewReport(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (patient.data && loggedUser.data) {
      formData.append('firstName', patient.data.firstName);
      formData.append('lastName', patient.data.lastName);
      formData.append('userFirstName', loggedUser.data.firstName);
      formData.append('userLastName', loggedUser.data.lastName);
      formData.append('userId', loggedUser.data._id);
      newReport && formData.append('report', newReport as Blob);
      if (reportType === 'medical') {
        uploadMed.mutate({ id: patient.data._id, form: formData });
      } else if (reportType === 'social') {
        uploadSoc.mutate({ id: patient.data._id, form: formData });
      }
    }
  };

  const handleDelete = (fileName: string) => {
    if (reportType === 'medical') {
      delMedicalReport.mutate({ id: patient.data?._id, fileName });
    } else if (reportType === 'social') {
      delSocialReport.mutate({ id: patient.data?._id, fileName });
    }
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      patient.refetch();
    } else if (type === 2 && !open && cookieError) router.push('/login');
  }, [open]);

  return (
    <>
      <Head>
        <title>{`AIDAM - Informes médicos de ${patient.data?.firstName} ${patient.data?.lastName}`}</title>
      </Head>
      <main className='flex flex-col items-center bg-background'>
        <div className='w-full lg:px-12 lg:mt-2.5'>
          <NavbarPatient />
          <h2 className='text-lm font-medium text-start flex items-center mt-2 lgMax:px-4'>
            {patient.data?.firstName} {patient.data?.lastName}
          </h2>
          <div className='flex lgMax:flex-col w-full'>
            <div className='flex flex-col lg:w-1/2 lgMax:px-4 lg:border-r border-black03 pr-5'>
              <div className='flex lgMax:flex-col lg:items-center justify-between'>
                <h1 className='text-xl2 font-medium lgMax:my-5'>INFORMES MÉDICOS</h1>
                {useMediaQuery(1024) && <hr className='border-black03 mb-4' />}
                <div className='flex lg:gap-9 lgMax:justify-between'>
                  <Link
                    href={`/patients/${query.id}/medicsocial/createMedical`}
                    className='flex items-center justify-center text-center lg:text-lm min-w-[100px]  text-sm font-medium p-3 py-2 text-white rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                  >
                    Generar
                  </Link>
                  <Button
                    onClick={() => {
                      setReportType('medical');
                      setOpenReportModal(true);
                    }}
                    text='Subir'
                  />
                </div>
              </div>
              {!useMediaQuery(1024) && <hr className='border-black03 mt-4' />}
              {/* <div className='flex justify-center lg:w-2/3 w-full mt-5 self-center'>
                <SearchBar
                  search={searchMedicals}
                  setSearch={setSearchMedicals}
                  width='w-full'
                  searchFn={setSearchedReports}
                  reportsType='medical'
                />
              </div> */}
              <div className={`flex w-full mt-8 ${medicalReports.length ? 'lg:min-h-[300px]' : ''}`}>
                {patient.isFetching ? (
                  <Spinner />
                ) : medicalReports.length ? (
                  <>
                    <div className='w-full px-4'>
                      {medicalReports.map((report, index) => {
                        return (
                          <ReportItem
                            index={`medicalReport.${index}`}
                            report={report}
                            setType={setType}
                            setOpen={setOpen}
                            setDeleteMsg={setDeleteMsg}
                            setFileNameToDelete={setFileNameToDelete}
                            width='w-full'
                            patient={patient.data}
                            setReportType={setReportType}
                            type='medical'
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className='w-full text-center'>El paciente no posee informes médicos cargados</p>
                )}
              </div>
            </div>
            <div className='flex flex-col lg:w-1/2 lgMax:px-4 pl-5'>
              <div className='flex lgMax:flex-col lg:items-center justify-between'>
                <h1 className='text-xl2 font-medium lgMax:my-5'>INFORMES SOCIALES</h1>
                {useMediaQuery(1024) && <hr className='border-black03 mb-4' />}
                <div className='flex lg:gap-9 lgMax:justify-between'>
                  <Link
                    href={`/patients/${query.id}/medicsocial/createSocial`}
                    className='flex items-center justify-center text-center lg:text-lm min-w-[100px]  text-sm font-medium p-3 py-2 text-white rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                  >
                    Generar
                  </Link>
                  <Button
                    onClick={() => {
                      setReportType('social');
                      setOpenReportModal(true);
                    }}
                    text='Subir'
                  />
                </div>
              </div>
              {!useMediaQuery(1024) && <hr className='border-black03 mt-4' />}
              {/* <div className='flex justify-center lg:w-2/3 w-full mt-5 self-center'>
                <SearchBar
                  search={searchSocials}
                  setSearch={setSearchSocials}
                  width='w-full'
                  searchFn={setSearchedReports}
                  reportsType='social'
                />
              </div> */}
              <div className={`flex w-full mt-8 ${socialReports.length ? 'min-h-[300px]' : ''}`}>
                {patient.isFetching ? (
                  <Spinner />
                ) : socialReports.length ? (
                  <>
                    <div className='w-full px-4'>
                      {socialReports.map((report, index) => {
                        return (
                          <ReportItem
                            index={`socialReport-${index}`}
                            report={report}
                            setType={setType}
                            setOpen={setOpen}
                            setDeleteMsg={setDeleteMsg}
                            setFileNameToDelete={setFileNameToDelete}
                            width='w-full'
                            patient={patient.data}
                            setReportType={setReportType}
                            type='social'
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className='w-full text-center'>El paciente no posee informes sociales cargados</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <UploadReportModal
          open={openReportModal}
          onClose={onCloseReportModal}
          handleFile={handleFile}
          handleSubmit={handleSubmit}
          value={newReport?.name}
        />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          type={type}
          errors={errors}
          deleteFunc={() => handleDelete(fileNameToDelete)}
          deleteMessage={deleteMsg}
        >
          <h1>{successMsg}</h1>
        </Modal>
      </main>
    </>
  );
};

export default medicSocial;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

medicSocial.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
