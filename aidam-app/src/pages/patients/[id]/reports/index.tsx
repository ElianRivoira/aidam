import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useMutation, useQuery } from '@tanstack/react-query';

import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/navbar/Navbar';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import useMediaQuery from '@/hooks/useMediaQuery';
import { deleteReport, getOnePatient, uploadReport } from '@/services/patients';
import ReportItem from '@/components/profile/patient/ReportItem';
import UploadReportModal from '@/components/profile/patient/UploadReportModal';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

const Reports = ({ query }: MyPageProps) => {
  const [cookieError, setCookieError] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<string[]>([]);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [newReport, setNewReport] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [fileNameToDelete, setFileNameToDelete] = useState('');
  const router = useRouter();

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
      setReports(patient.reports);
    },
  });

  const upload = useMutation({
    mutationFn: uploadReport,
    onSuccess: editedPatient => {
      setSuccessMsg('Informe cargado correctamente');
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

  const delReport = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      setSuccessMsg('Informe eliminado correctamente');
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    files && setNewReport(files[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (patient.data) {
      formData.append('firstName', patient.data.firstName);
      formData.append('lastName', patient.data.lastName);
      newReport && formData.append('report', newReport as Blob);
      upload.mutate({ id: patient.data._id, form: formData });
    }
  };

  const setSearchedReports = (search: string, reportsType?: string) => {
    let searchedReports: string[] = [];
    if (patient.data) {
      if (search.length) {
        searchedReports = patient.data.reports.filter(report => {
          return report.toLowerCase().includes(search.toLowerCase());
        });
      }
      if (searchedReports.length) {
        console.log(searchedReports, 'ASD');
        setReports(searchedReports);
      } else {
        setReports(patient.data.reports);
      }
    }
  };

  const handleDelete = (fileName: string) => {
    delReport.mutate({ id: patient.data?._id, fileName });
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      patient.refetch();
    } else if (type === 2 && !open && cookieError) router.push('/login');
  }, [open]);

  return (
    <>
      <Head>
        <title>{`AIDAM - Informes de ${patient.data?.firstName} ${patient.data?.lastName}`}</title>
      </Head>
      <main className='flex flex-col items-center min-h-screen bg-background'>
        {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />}
        <div className='w-full lg:px-12 lg:mt-2.5'>
          <NavbarPatient />
          <div className='flex flex-col lgMax:px-4'>
            <div className='flex lgMax:flex-col lg:items-center justify-between lg:mt-5 mt-2.5'>
              <h2 className='lgMax:text-lm text-xg font-medium'>
                {patient.data?.firstName} {patient.data?.lastName}
              </h2>
              <h1 className='text-xl2 font-medium lgMax:my-5'>INFORMES</h1>
              {useMediaQuery(1024) && <hr className='border-black03 mb-4' />}
              <div className='flex lg:gap-9 lgMax:justify-between'>
                <Link
                  href={`/patients/${query.id}/reports/create`}
                  className='flex items-center text-lm font-medium lgMax:font-normal p-2.5 lgMax:py-2 text-white rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                >
                  Generar Informe
                </Link>
                <Button onClick={() => setOpenReportModal(true)} text='Subir informe' />
              </div>
            </div>
            {!useMediaQuery(1024) && <hr className='border-black03 mt-4' />}
            <div className={`flex w-full mt-8 ${reports ? 'min-h-[300px]' : ''}`}>
              {useMediaQuery(1024) ? (
                <>
                  {patient.isFetching ? (
                    <div className='h-14 flex justify-center w-full'>
                      <Spinner />
                    </div>
                  ) : reports.length ? (
                    <div className='w-full px-4'>
                      {reports.map(report => (
                        <ReportItem
                          index={report}
                          report={report}
                          setType={setType}
                          setOpen={setOpen}
                          setDeleteMsg={setDeleteMsg}
                          setFileNameToDelete={setFileNameToDelete}
                          width='w-full'
                          patient={patient.data}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className='w-full text-center'>El paciente no posee informes cargados</p>
                  )}
                </>
              ) : (
                <>
                  {patient.isFetching ? (
                    <div className='h-14 flex justify-center w-full'>
                      <Spinner />
                    </div>
                  ) : reports.length ? (
                    <>
                      <div className={`w-1/2 flex flex-col items-center ${reports ? 'border-r border-black03' : ''}`}>
                        {reports.slice(0, Math.ceil(reports.length / 2)).map(report => {
                          console.log('report dentro del map half1', report);
                          return (
                            <ReportItem
                              index={report}
                              report={report}
                              setType={setType}
                              setOpen={setOpen}
                              setDeleteMsg={setDeleteMsg}
                              setFileNameToDelete={setFileNameToDelete}
                              patient={patient.data}
                            />
                          );
                        })}
                      </div>
                      <div className='w-1/2 flex flex-col items-center'>
                        {reports.slice(Math.ceil(reports.length / 2)).map(report => (
                          <ReportItem
                            index={report}
                            report={report}
                            setType={setType}
                            setOpen={setOpen}
                            setDeleteMsg={setDeleteMsg}
                            setFileNameToDelete={setFileNameToDelete}
                            patient={patient.data}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className='w-full text-center'>El paciente no posee informes cargados</p>
                  )}
                </>
              )}
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

export default Reports;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

Reports.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
