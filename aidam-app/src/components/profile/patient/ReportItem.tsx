import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import deleteIcon from '@/assets/icons/deleteIcon.svg';
import { handleDownloadReport } from '@/utils/handleDownload';
import pdfIcon2 from '@/assets/icons/pdfIcon2.png';
import wordIcon from '@/assets/icons/wordIcon.png';

interface ReportItemProps {
  index: string;
  report: string;
  setType: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteMsg: React.Dispatch<React.SetStateAction<string>>;
  setFileNameToDelete: React.Dispatch<React.SetStateAction<string>>;
  width?: string;
  patient: Patient | undefined;
  setReportType?: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
}

const ReportItem: React.FC<ReportItemProps> = ({
  index,
  report,
  setOpen,
  setType,
  setDeleteMsg,
  setFileNameToDelete,
  width,
  patient,
  setReportType,
  type,
}) => {
  const [fileExtension, setfileExtension] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const splittedReportName = report.split('.');
    const extension = splittedReportName[splittedReportName.length - 1];
    setfileExtension(extension);
    patient && setFileName(report.split(`${patient.firstName}-${patient.lastName}_`)[1]);
  }, []);

  return (
    <div
      key={index}
      className={`flex justify-between items-center ${
        width ? width : 'w-2/3'
      } mb-3 hover:text-lightBlue lgMax:text-lightBlue cursor-pointer transition-colors`}
    >
      <div className='w-full flex items-center' onClick={() => handleDownloadReport(report, type)}>
        <Image
          src={fileExtension === 'pdf' ? pdfIcon2 : wordIcon}
          alt='icono de archivo'
          className='w-8'
        />
        <p className='text-lb w-full ml-1'>{fileName}</p>
      </div>
      <button
        onClick={() => {
          setDeleteMsg('¿Está seguro que desea eliminar este informe?');
          setType(4);
          setOpen(true);
          setFileNameToDelete(report);
          if (setReportType && type) setReportType(type);
        }}
      >
        <Image src={deleteIcon} alt='eliminar informe' className='w-8' />
      </button>
    </div>
  );
};

export default ReportItem;
