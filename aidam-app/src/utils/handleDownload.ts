export const handleDownloadCertificate = (fileName: string) => {
  window.open(`http://${process.env.NEXT_PUBLIC_DOWNLOAD}/download/certificate/${fileName}`);
};

export const handleDownloadReport = (fileName: string, type: string | undefined) => {
  if(!type) window.open(`http://${process.env.NEXT_PUBLIC_DOWNLOAD}/patients/reports/${fileName}`);
  else if (type === 'medical') window.open(`http://${process.env.NEXT_PUBLIC_DOWNLOAD}/patients/reports/medical/${fileName}`);
  else if (type === 'social') window.open(`http://${process.env.NEXT_PUBLIC_DOWNLOAD}/patients/reports/social/${fileName}`);
};