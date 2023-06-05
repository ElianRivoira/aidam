import jsPDF from 'jspdf';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import SignatureCanvas from 'react-signature-canvas';

import { centerHeaders, checkPageBreak, inputLine, subtitle, textArea } from '@/utils/jsPDF';
import calculateAge from '@/utils/calculateAge';

export const generateHCPDF = (
  e: React.FormEvent<HTMLFormElement>,
  medicalFormData: MedicalFormData,
  patient: UseQueryResult<Patient, unknown>,
  loggedUser: UseQueryResult<User, unknown>,
  firmaRef: React.RefObject<SignatureCanvas>,
  uploadMed: UseMutationResult<
    Patient,
    any,
    {
      id: string;
      form: FormData;
    },
    unknown
  >
) => {
  e.preventDefault();

  const doc = new jsPDF();

  const lineHeight = 5;
  const spacing = 6;
  const headingFontSize = 14;
  const x = 10;
  let y = 10;

  centerHeaders('HISTORIA CLÍNICA - AIDAM', doc, headingFontSize, y);
  y += spacing;

  y = subtitle(doc, 'I - Evaluación de Crecimiento y Desarrollo', x, y, spacing);
  y = subtitle(doc, `Fecha: ${medicalFormData.date1}`, x, y, 15);

  y = subtitle(doc, `Identificación`, x, y, spacing);
  y = inputLine(doc, `Nombre y Apellido: ${patient.data?.firstName} ${patient.data?.lastName}`, x, y, spacing);
  y = inputLine(doc, `Edad: ${patient.data?.birth && calculateAge(patient.data.birth)}`, x, y, spacing);
  y = inputLine(
    doc,
    `Fecha de Nacimiento: ${patient.data?.birth && new Date(patient.data.birth).toLocaleString('es-ES').split(',')[0]}`,
    x,
    y,
    spacing
  );
  y = inputLine(doc, `DNI: ${patient.data?.dni}`, x, y, spacing);
  y = inputLine(doc, `Obra Social: ${patient.data?.socialwork}`, x, y, 15);

  y = subtitle(doc, `Informante: ${loggedUser.data?.firstName} ${loggedUser.data?.lastName}`, x, y, 15);

  y = subtitle(doc, `Motivo de consulta:`, x, y, spacing);
  y = textArea(doc, medicalFormData.motivoConsulta, x, y, lineHeight);

  y = subtitle(doc, `Antecedentes de embarazo y perinatales:`, x, y, spacing);
  y = subtitle(doc, `OEA:`, x, y, lineHeight, 10);
  y = textArea(doc, medicalFormData.oea, x, y, lineHeight, 1);
  y = subtitle(doc, `Tamiz metabólico:`, x, y, lineHeight, 10);
  y = textArea(doc, medicalFormData.tamizMetabólico, x, y, lineHeight, 1);
  y = subtitle(doc, `Factores pronósticos negativos:`, x, y, lineHeight, 10);
  y = textArea(doc, medicalFormData.factoresNegativos, x, y, lineHeight, 5);

  y = subtitle(doc, `Antecedentes familiares:`, x, y, spacing);
  y = textArea(doc, medicalFormData.antecedentesFamiliares, x, y, lineHeight, 5);

  y = subtitle(doc, `Desarrollo psicomotor:`, x, y, spacing);
  y = subtitle(doc, `Alimentación:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.alimentacion, x, y, lineHeight, 1);
  y = subtitle(doc, `Sueño:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.sueño, x, y, lineHeight, 1);
  y = subtitle(doc, `Motricidad gruesa:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.motricidadGruesa, x, y, lineHeight, 1);
  y = subtitle(doc, `Motricidad fina:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.motricidadFina, x, y, lineHeight, 1);
  y = subtitle(doc, `Control de esfínteres:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.controlEsfinteres, x, y, lineHeight, 1);
  y = subtitle(doc, `Temperamento:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.temperamento, x, y, lineHeight, 10);

  y = subtitle(doc, `Desarrollo social:`, x, y, spacing);
  y = textArea(doc, medicalFormData.desarrolloSocial, x, y, lineHeight, 5);

  y = subtitle(doc, `Desarrollo comunicativo:`, x, y, spacing);
  y = inputLine(
    doc,
    `Lenguaje expresivo: ${medicalFormData.desarrolloComunicativo === 'Lenguaje expresivo' ? 'X' : ''}`,
    x,
    y,
    spacing
  );
  y = inputLine(
    doc,
    `Lenguaje comprensivo: ${medicalFormData.desarrolloComunicativo === 'Lenguaje comprensivo' ? 'X' : ''}`,
    x,
    y,
    spacing
  );
  y = inputLine(
    doc,
    `Lenguaje no verbal: ${medicalFormData.desarrolloComunicativo === 'Lenguaje no verbal' ? 'X' : ''}`,
    x,
    y,
    15
  );

  y = subtitle(doc, `Antecedentes conductuales:`, x, y, spacing);
  y = subtitle(doc, `Situación estresante en último año:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.situacionEstresante, x, y, lineHeight, 1);
  y = subtitle(doc, `Factores de riesgo identificados:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.factoresRiesgo, x, y, lineHeight, 5);

  y = subtitle(doc, `Trayectoria escolar:`, x, y, spacing);
  y = subtitle(doc, `Funcionamiento escolar global:`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.trayectoriaEscolar, x, y, lineHeight, 5);

  y = subtitle(doc, `Antecedentes patológicos personales:`, x, y, spacing);
  y = textArea(doc, medicalFormData.antecedentesPatologicos, x, y, lineHeight, 5);

  y = subtitle(doc, `Examen físico:`, x, y, spacing);
  y = inputLine(doc, `Peso: ${medicalFormData.peso}`, x, y, spacing);
  y = inputLine(doc, `Talla: ${medicalFormData.talla}`, x, y, spacing);
  y = inputLine(doc, `IMC - A P/T: ${medicalFormData.imcapt}`, x, y, spacing);
  y = inputLine(doc, `Perímetro cefálico: ${medicalFormData.perimetroCefalico}`, x, y, spacing);
  y = inputLine(doc, `TA: ${medicalFormData.ta}`, x, y, spacing);
  y = inputLine(doc, `Exploración física actual: ${medicalFormData.exploracionFisica}`, x, y, 15);

  y = subtitle(doc, `Exámenes, evaluaciones y tratamientos previos:`, x, y, spacing);
  y = textArea(doc, medicalFormData.examenesPrevios, x, y, lineHeight, 5);

  y = subtitle(
    doc,
    `Evaluaciones y terapias conductuales o educativas complementarias y/o alternativas:`,
    x,
    y,
    spacing
  );
  y = textArea(doc, medicalFormData.evaluacionesComplementarias, x, y, lineHeight, 5);

  y = subtitle(doc, `II - Pruebas de detección estandarizadas:`, x, y, spacing);
  y = textArea(doc, medicalFormData.pruebasEstandarizadas, x, y, lineHeight, 5);

  y = subtitle(doc, `III - Evaluación Sensorio - Motora:`, x, y, spacing);
  y = subtitle(doc, `a) Audición:`, x, y, spacing, 10);
  y = subtitle(doc, `Fecha: ${medicalFormData.dateA}`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.audicion, x, y, lineHeight, 5);
  y = subtitle(doc, `b) Visión:`, x, y, spacing, 10);
  y = subtitle(doc, `Fecha: ${medicalFormData.dateB}`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.vision, x, y, lineHeight, 5);
  y = subtitle(doc, `c) Procesamiento sensorial:`, x, y, spacing, 10);
  y = subtitle(doc, `Fecha: ${medicalFormData.dateC}`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.procesamientoSensorial, x, y, lineHeight, 5);
  y = subtitle(doc, `d) Evaluación motora:`, x, y, spacing, 10);
  y = subtitle(doc, `Fecha: ${medicalFormData.dateD}`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.evaluacionMotora, x, y, lineHeight, 5);

  y = subtitle(doc, `IV - Evaluación Neurocognitiva:`, x, y, spacing);
  y = subtitle(doc, `Fecha: ${medicalFormData.dateE}`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.evalNeurocognitiva, x, y, lineHeight, 5);

  y = subtitle(doc, `V - Evaluación Neurolingüística:`, x, y, spacing);
  y = subtitle(doc, `Fecha: ${medicalFormData.dateF}`, x, y, spacing, 10);
  y = textArea(doc, medicalFormData.evalNeurolinguistica, x, y, lineHeight, 5);

  y = subtitle(doc, `VI - Diagnóstico:`, x, y, spacing);
  y = textArea(doc, medicalFormData.diagnostico, x, y, lineHeight, 5);

  y = subtitle(doc, `VII - Sugerencias terapéuticas:`, x, y, spacing);
  y = textArea(doc, medicalFormData.sugerenciasTerapeuticas, x, y, lineHeight, 5);

  let firmaData;
  if (firmaRef.current) {
    firmaData = firmaRef.current.toDataURL();
  }
  const firmaWidth = 70;
  const firmaHeight = 30;
  y = checkPageBreak(doc, y, 50);
  firmaData && doc.addImage(firmaData, 'PNG', 110, y, firmaWidth, firmaHeight);
  y = checkPageBreak(doc, y + 35);
  y = inputLine(doc, `${loggedUser.data?.firstName} ${loggedUser.data?.lastName}`, 165, y, spacing);
  const blobDoc = doc.output('blob');
  const file = new File([blobDoc], `Historia clinica.pdf`, {
    type: 'application/pdf',
  });
  if (patient.data && loggedUser.data) {
    const formData = new FormData();
    formData.append('firstName', patient.data.firstName);
    formData.append('lastName', patient.data.lastName);
    formData.append('userFirstName', loggedUser.data.firstName);
    formData.append('userLastName', loggedUser.data.lastName);
    formData.append('report', file as Blob);
    uploadMed.mutate({ id: patient.data._id, form: formData });
  }
};

export const generateHCFPDF = (
  e: React.FormEvent<HTMLFormElement>,
  patient: UseQueryResult<Patient, unknown>,
  loggedUser: UseQueryResult<User, unknown>,
  firmaRef: React.RefObject<SignatureCanvas>,
  uploadMed: UseMutationResult<
    Patient,
    any,
    {
      id: string;
      form: FormData;
    },
    unknown
  >,
  data: PhysiatricFormData
) => {
  e.preventDefault();
  let birthDate;
  let day, month, year;
  let age;
  let currentDate = new Date();
  let signatureData;
  if (firmaRef.current) {
    signatureData = firmaRef.current.toDataURL();
  }
  if (patient.data?.birth) {
    birthDate = new Date(patient.data?.birth);
    birthDate = birthDate.toLocaleString('es-ES').split(',');
    birthDate = birthDate[0];
    [day, month, year] = birthDate.split('/');
    day = Number(day);
    month = Number(month);
    year = Number(year);
    if (currentDate.getMonth() > month) {
      age = currentDate.getFullYear() - year;
    } else if (currentDate.getMonth() == month) {
      if (currentDate.getDay() >= day) {
        age = currentDate.getFullYear() - year;
      } else {
        age = currentDate.getFullYear() - year - 1;
      }
    } else {
      age = currentDate.getFullYear() - year - 1;
    }
  }

  let y = 10;

  const doc = new jsPDF();
  doc.setFont('Helvetica');
  doc.setFontSize(10);
  const lineHeight = 10;
  const spacing = 6;
  const headingFontSize = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const tagWidth = 80;
  const auxiliarWidth = 100;
  let x = 10;

  function generateCheck(arr: Array<string>, obj: any, optionalTagWidth?: number) {
    arr.forEach((tag, index) => {
      if (x + tagWidth >= pageWidth) {
        y += 10;
        x = 10;
      }
      y = checkPageBreak(doc, y);
      let result = 'No';
      let currentProperty = obj[`checkbox${index + 1}`];
      if (currentProperty) result = 'Si';
      doc.text(`${tag}: ${result}`, x, y);

      x += tagWidth;
    });
  }

  centerHeaders('HISTORIA CLÍNICA FISIÁTRICA', doc, headingFontSize, y);
  doc.setFontSize(10);
  doc.setFont('Helvetica', 'normal');
  y += 10;
  doc.text(`Edad: ${age} años`, 10, y);
  doc.text(`CUD: ${patient.data?.cud}`, 125, y);
  y += 10;
  doc.text(`FN: ${birthDate}`, 10, y);
  doc.text(`Tel: ${patient.data?.phone}`, 125, y);
  y += 10;
  doc.text(`DNI: ${patient.data?.dni}`, 10, y);
  y += 10;
  doc.text(`Dirección: ${patient.data?.adress}`, 10, y);
  y += 10;
  doc.text(`Obra Social: ${patient.data?.socialwork}`, 10, y);
  y += 10;
  doc.text(`Fecha de evaluación: ${data.reportDate}`, 10, y);
  y += 10;
  centerHeaders('ANTECEDENTES MATERNOS', doc, headingFontSize, y);
  doc.setFontSize(12);
  y += 10;
  doc.text(`Embarazo:`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  generateCheck(['A término', 'Prematuro', 'Controlado'], data.embarazoValues);
  x = 10;
  y += 10;
  doc.text(`Patologias: ${data.embarazoOptional}`, 10, y);
  doc.setFont('Helvetica', 'bold');
  y += 10;
  doc.setFontSize(12);
  doc.text(`Parto:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Espontaneo', 'Inducido', 'Cesarea', 'Fórceps'], data.partoValues);
  x = 10;
  y += 10;
  centerHeaders('CARACTERISTICAS RECIEN  NACIDO', doc, headingFontSize, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(
    ['Prematuro', 'A Término', 'Gemelar', 'Fórceps', 'Incubadora', 'Ictericia', 'Convulsiones'],
    data.recienNacido
  );
  y += 10;
  doc.text(`Otros: ${data.recienNacidoOptional}`, 10, y);
  y += 10;
  centerHeaders('CARACTERISTICAS DEL DESARROLLO', doc, headingFontSize, y);
  doc.setFontSize(10);
  y += 10;
  x = 10;
  doc.setFont('Helvetica', 'normal');
  data.hitosDeDesarrollo.forEach(hito => {
    if (x + auxiliarWidth > pageWidth) {
      y += 10;
      x = 10;
    }
    y = checkPageBreak(doc, y);

    doc.text(`${hito.name}: ${hito.value} meses`, x, y);

    x += auxiliarWidth;
  });

  y += 10;
  centerHeaders('ESTUDIOS COMPLEMENTARIOS', doc, headingFontSize, y);
  doc.setFontSize(10);
  y += 10;
  x = 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['RMN', 'RX', 'TAC', 'PEV', 'OEA', 'PEA'], data.complementario);
  y += 10;
  x = 10;
  y = checkPageBreak(doc, y);
  doc.text(`CIRUGÍAS:`, 10, y);
  y += 6;
  y = textArea(doc, data.cirugia, x, y, 5, undefined);
  centerHeaders('ESTADO ACTUAL', doc, headingFontSize, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(`Conducta:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(
    [
      'Adecuada',
      'Impulsiva',
      'Indiferencia al medio',
      'Autoagresivo',
      'Heteroagresivo',
      'Inquietud motora',
      'Estereotipias',
      'Aislamiento',
      'Negativismo',
    ],
    data.conducta
  );
  x = 10;
  y += 10;
  doc.text(`Otros: ${data.conductaOptional}`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Lenguaje:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Adecuado a la edad', 'Infantil', 'Dislalias', 'Disartria', 'Pobre', 'No habla'], data.lenguaje);
  x = 10;
  y += 10;
  doc.text(`Otros: ${data.lenguajeOptional}`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Visión:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Normal', 'Usa lentes', 'Ceguera', 'Retinopatía', 'Estrabismo', 'Cataratas'], data.vision);
  x = 10;
  y += 10;
  doc.text(`Otros: ${data.visionOptional}`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Audición:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Normal', 'Hipoacusia', 'Audífonos'], data.audicion);
  x = 10;
  y += 10;
  doc.text(`Otros: ${data.audicionOptional}`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Comprensión:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(
    ['Adecuada a la edad:', 'Limitada', 'Responde a consignas elementales', 'No responde a consignas elementales'],
    data.comprension,
    90
  );
  x = 10;
  y = checkPageBreak(doc, y)
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Control de esfínteres:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Vesical total', 'Parcial', 'No controla', 'Anal total', 'Parcial', 'No controla'], data.esfinteres);
  x = 10;
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Alimentación:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Conservada', 'Sonda nasogástrica', 'Gastrostomía'], data.alimentacion);
  x = 10;
  y += 10;
  doc.text(`Otros: ${data.alimentacionOptional}`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Patrones de sueño:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  doc.setFont('Helvetica', 'normal');
  generateCheck(['Conservado', 'Insomnio'], data.sueño);
  x = 10;
  y += 10;
  doc.text(`Otros: ${data.sueñoOptional}`, 10, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Escolaridad:`, 10, y);
  doc.setFont('Helvetica', 'normal');
  y += 10;
  doc.text(`Primaria:`, 10, y);
  y += 10;
  doc.setFontSize(10);
  generateCheck(['Común', 'Integrada', 'Domiciliaria'], data.primaria);
  x = 10;
  y += 10;
  doc.setFontSize(12);
  doc.text(`Secundaria:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  generateCheck(['Común', 'Integrada', 'Domiciliaria'], data.secundaria);
  x = 10;
  y += 10;
  doc.setFontSize(12);
  doc.text(`Adaptación:`, 10, y);
  doc.setFontSize(10);
  y += 10;
  generateCheck(['Buena', 'Regular', 'Mala'], data.adaptacion);
  x = 10;
  y += 10;
  doc.setFontSize(12);
  doc.text(`Lectoescritura:`, 10, y);
  y += 10;
  doc.setFontSize(10);
  generateCheck(['Si', 'No'], data.lectoEscritura);
  x = 10;
  y += 10;
  doc.setFontSize(12);
  doc.text('Observaciones:', 10, y)
  y += 6
  y = textArea(doc, data.obsLectoescritura, x, y, 5);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`DIAGNÓSTICO ETIOLÓGICO:`, 10, y);
  y += 6;
    
  y = textArea(doc, data.diagEtiologico, x, y, 5);
  y += 5;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`DIAGNÓSTICO FUNCIONAL:`, 10, y);
  y += 6;

  y = textArea(doc, data.diagFuncional, x, y, 5);
  y += 5;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`ASPECTO MOTOR:`, 10, y);

  y = checkPageBreak(doc, y);

  y += 10;
  doc.setFontSize(12);
  doc.text(`GMFCS:`, 10, y);
  y += 10;

  y = textArea(doc, data.gmfcs, x, y, 5);
  y += 5;

  y = checkPageBreak(doc, y);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`MARCHA:`, 10, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  y += 6;
  generateCheck(['Independiente', 'Dependiente'], data.marcha);
  x = 10;
  y += 10;
  y = checkPageBreak(doc, y);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`EQUIPAMIENTO:`, 10, y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  y += 6;
  generateCheck(['Ortesis', 'Bastones', 'Andador', 'Silla de ruedas'], data.equipamiento);
  x = 10;
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`HÁBITOS DE LA VIDA DIARIA (AVD):`, 10, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`ESCALA FIM:`, 10, y);
  y += 6;
  doc.setFontSize(10);
  y = textArea(doc, data.fim, x, y, 5)
  y += 1;
  doc.setFontSize(12);
  doc.text('ESCALA BARTHEL:', x, y)
  y += 6;
  doc.setFontSize(10);
  y = textArea(doc, data.barthel, x, y, 5);
  doc.setFontSize(12);
  y += 1;
  doc.text('OTROS:', x, y)
  y += 6;
  doc.setFontSize(10);
  y = textArea(doc, data.otraEscala, x, y, 5);
  y += 6;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`MEDICACIÓN ACTUAL:`, 10, y);
  y += 6;

  y = textArea(doc, data.medActual, x, y, 5);
  y += 5;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`INTERCONSULTAS:`, 10, y);
  y += 6;

  y = textArea(doc, data.inter, x, y, 5);
  y += 5;
  
  y = checkPageBreak(doc, y);
  doc.setFontSize(14);
  centerHeaders('PLAN TERAPÉUTICO', doc, headingFontSize, y);
  y = checkPageBreak(doc, y);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.text(`OBJETIVOS:`, 10, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  y = textArea(doc, data.objectives, x, y, 5)
  y += 5
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`OBSERVACIONES:`, 10, y);
  doc.setFontSize(10);
  y += 6;
  doc.setFont('Helvetica', 'normal');

  y = textArea(doc, data.observations, x, y, 5)
  y += 5
  const signatureWidth = 70;
  const signatureHeight = 30;
  if (signatureData) doc.addImage(signatureData, 'PNG', 10, y, signatureWidth, signatureHeight);
  doc.text(`${loggedUser.data?.firstName} ${loggedUser.data?.lastName}`, 125, y + 10);

  const blobDoc = doc.output('blob');
  const file = new File(
    [blobDoc],
    `Historia clinica fisiatrica.pdf`,
    {
      type: 'application/pdf',
    }
  );
  if (patient.data && loggedUser.data) {
    const formData = new FormData();
    formData.append('firstName', patient.data.firstName);
    formData.append('lastName', patient.data.lastName);
    formData.append('userFirstName', loggedUser.data.firstName);
    formData.append('userLastName', loggedUser.data.lastName);
    formData.append('report', file as Blob);
    uploadMed.mutate({ id: patient.data._id, form: formData });
  }
};
