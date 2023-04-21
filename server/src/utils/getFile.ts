import fs from 'fs'
import path from 'path'

const getFile = (keywords: string[]) => {
  const CERT_DIR = path.join(__dirname, '../../certificates');
  // const KEYWORDS = ['Pepe', 'Test', '23232313'];
  
  // Obtener la lista de archivos en la carpeta de certificados
  const files = fs.readdirSync(CERT_DIR);
  
  // Filtrar los archivos para obtener solo aquellos que cumplen ciertas condiciones
  const filteredFiles = files.filter((file) => {
    const fileExtension = path.extname(file);
    const fileName = path.basename(file, fileExtension);
    return keywords.every((keyword) => fileName.includes(keyword)) && fileExtension === '.pdf';
  });
  
  // Ordenar los archivos por fecha de modificación
  const sortedFiles = filteredFiles.sort((a, b) => {
    const statA = fs.statSync(path.join(CERT_DIR, a));
    const statB = fs.statSync(path.join(CERT_DIR, b));
    return statB.ctime.getTime() - statA.ctime.getTime();
  });
  // Obtener el archivo más reciente
  return sortedFiles[0];
}

export default getFile