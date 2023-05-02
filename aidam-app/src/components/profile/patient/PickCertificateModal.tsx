import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UseMutationResult } from '@tanstack/react-query';

import pdfIcon from '@/assets/icons/pdfIcon.png';
import x from '@/assets/icons/x.svg';
import styles from '@/styles/PickCertificateModal.module.css';
import Modal from '@/components/Modal';

interface PickCertificateModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | undefined;
  handleDownload: (fileName: string) => Promise<void>;
  admin: boolean | undefined;
  openCertModal: boolean;
  setOpenCertModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeCertModal: React.Dispatch<React.SetStateAction<number>>;
  typeCertModal: number;
  delCert: UseMutationResult<
    void,
    any,
    {
      id: string | undefined;
      fileName: string;
    },
    unknown
  >;
}

const PickCertificateModal: React.FC<PickCertificateModalProps> = ({
  open,
  onClose,
  patient,
  handleDownload,
  admin,
  openCertModal,
  setOpenCertModal,
  typeCertModal,
  setTypeCertModal,
  delCert,
}) => {
  if (!open) return null;
  const [deleteMsg, setDeleteMsg] = useState('');
  const [fileNameToDelete, setFileNameToDelete] = useState('');

  return (
    <>
      <div
        onClick={onClose}
        className='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] z-50'
      />
      <div className='text-center fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-white p-8 z-50 rounded-md flex flex-col items-center'>
        <h1 className='font-semibold text-xl1 mb-6'>CERTIFICADOS</h1>
        <div className='flex flex-wrap justify-around'>
          {patient?.certificate ? (
            patient.certificate.map((cert, index) => {
              const certNameSplitted = cert.split('-');
              const day = certNameSplitted[3];
              const month = certNameSplitted[4];
              const year = certNameSplitted[5].split('.')[0];
              return (
                <div
                  key={index}
                  className={`${styles.divCertificate} w-fit flex flex-col border border-white hover:border-black03 rounded-md pt-0 transition-all`}
                >
                  <button
                    onClick={() => {
                      setDeleteMsg(
                        '¿Está seguro que desea eliminar este certificado?'
                      );
                      setTypeCertModal(4);
                      setOpenCertModal(true);
                      setFileNameToDelete(cert);
                    }}
                    className={`w-fit self-end h-[18px] mr-1 mt-1 -mb-1`}
                  >
                    <Image
                      src={x}
                      alt='eliminar'
                      width={18}
                      className={`${styles.x} hidden`}
                    />
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
                    className='flex flex-col items-center p-3 pt-0'
                  >
                    <Image src={pdfIcon} alt='pdfIcon' />
                    <p className='font-medium'>
                      {day}-{month}-{year}
                    </p>
                  </button>
                </div>
              );
            })
          ) : (
            <>
              <h1>Aún no se ha cargado ningún certificado</h1>
              {admin ? (
                <p>
                  Haga click{' '}
                  <Link href={`/admin/patients/edit/${patient?._id}`}>
                    aquí
                  </Link>{' '}
                  para cargar un certificado
                </p>
              ) : null}
            </>
          )}
        </div>
        <button
          className='mt-6 border rounded-md w-full min-w-[250px] bg-aidam80 text-white h-10 hover:bg-aidam70 active:shadow-active transition-colors'
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
      <Modal
        open={openCertModal}
        onClose={() => setOpenCertModal(false)}
        type={typeCertModal}
        deleteFunc={() =>
          delCert.mutate({ id: patient?._id, fileName: fileNameToDelete })
        }
        // deleteMessage = {deleteMsg}
      >
        <h1>Certificado eliminado correctamente</h1>
      </Modal>
    </>
  );
};

export default PickCertificateModal;
