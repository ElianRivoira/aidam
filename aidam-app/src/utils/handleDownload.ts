export const handleDownloadCertificate = (fileName: string) => {
  window.open(`http://localhost:8000/download/certificate/${fileName}`);
};

export const handleDownloadReport = (fileName: string, type: string | undefined) => {
  if(!type) window.open(`http://localhost:8000/patients/reports/${fileName}`);
  else if (type === 'medical') window.open(`http://localhost:8000/patients/reports/medical/${fileName}`);
  else if (type === 'social') window.open(`http://localhost:8000/patients/reports/social/${fileName}`);
};