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
    `Fecha de Nacimiento: ${patient.data?.birth && new Date(patient.data.birth).toLocaleString().split(',')[0]}`,
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
  const file = new File([blobDoc], 'Historia clinica fisiatrica.pdf', { type: 'application/pdf' });
  if (patient.data) {
    const formData = new FormData();
    formData.append('firstName', patient.data.firstName);
    formData.append('lastName', patient.data.lastName);
    formData.append('report', file as Blob);
    uploadMed.mutate({ id: patient.data._id, form: formData });
  }
};
