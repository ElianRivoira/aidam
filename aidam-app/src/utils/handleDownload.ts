export const handleDownloadCertificate = (fileName: string) => {
  window.open(`http://localhost:8000/download/certificate/${fileName}`);
};

export const handleDownloadReport = (fileName: string) => {
  window.open(`http://localhost:8000/patients/reports/${fileName}`);
};