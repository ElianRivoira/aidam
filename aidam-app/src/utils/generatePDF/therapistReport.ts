import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { checkPageBreak } from '../jsPDF';

export const generateTRPDF = (
  e: React.FormEvent<HTMLFormElement>,
  patient: UseQueryResult<Patient, unknown>,
  user: User | undefined,
  firmaRef: React.RefObject<SignatureCanvas>,
  upload: UseMutationResult<
    Patient,
    any,
    {
      id: string;
      form: FormData;
    },
    unknown
  >,
  data: TherapistFormData
) => {
  e.preventDefault();
  let birthDate;
  if (patient.data?.birth) {
    birthDate = new Date(patient.data?.birth);
    birthDate = birthDate.toLocaleString('es-ES').split(',');
    birthDate = birthDate[0];
  }

  let signatureData;
  if (firmaRef.current) {
    signatureData = firmaRef.current.toDataURL();
  }

  let y = 10;

  const doc = new jsPDF();
  doc.setFont('Helvetica');
  doc.setFontSize(10);
  const lineHeight = 5;
  const spacing = 6;
  const headingFontSize = 14;

  function checkPageBreakk() {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y > pageHeight - lineHeight) {
      doc.addPage();
      y = 10;
    }
  }

  function centerHeaders(text: string) {
    const headingText = text;
    const headingFontWidth =
      (doc.getStringUnitWidth(headingText) * headingFontSize) /
      doc.internal.scaleFactor;
    const headingX = (doc.internal.pageSize.getWidth() - headingFontWidth) / 2;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(headingFontSize);
    doc.text(headingText, headingX, y);
  }

  centerHeaders('PLAN TERAPÉUTICO INTEGRAL');
  y += 10;
  doc.setFontSize(10);
  doc.text(`FECHA: ${data.reportDate}`, 10, y);
  y += 10;
  doc.text(
    `PERÍODO: ${data.reportPeriod} a Diciembre ${data.currentYear}`,
    10,
    y
  );
  y += 10;
  doc.text(`ESPECIALIDAD: ${user?.profession}`, 10, y);
  y += 10;
  doc.text(`PROFESIONAL: ${user?.firstName} ${user?.lastName}`, 10, y);
  y += 10;
  doc.textWithLink(`DATOS DEL PACIENTE:`, 10, y, {
    url: '',
    decoration: 'underline',
  });
  y += 10;
  doc.text(
    `NOMBRE Y APELLIDO: ${patient.data?.firstName} ${patient.data?.lastName}`,
    10,
    y
  );
  y += 10;
  doc.text(`FECHA DE NACIMIENTO: ${birthDate}`, 10, y);
  y += 10;
  doc.text(`DNI: ${patient.data?.dni}`, 10, y);
  y += 10;
  doc.text(`DIAGNÓSTICO: ${patient.data?.diagnosis}`, 10, y);
  y += 10;
  doc.text(`OBRA SOCIAL: ${patient.data?.socialwork}`, 10, y);
  doc.text(`AF: ${patient.data?.affiliateNumber}`, 125, y);
  y += 20
  centerHeaders('INFORME DE EVUALUACIÓN TERAPÉUTICA');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  y += 10;
  doc.text(
    'Se realiza la evaluación inicial del área, obteniendo los siguientes resultados:',
    10,
    y
  );
  y += 6;
  const maxWidth = 180;

  doc.setFont('Helvetica', 'normal');

  const generalAspectsText =
    'En relación al accionar del paciente y el encuadre, se puede puntualizar que: ' +
    data.generalAspects;

  const splitText = doc.splitTextToSize(generalAspectsText, maxWidth);
  splitText.forEach((line: string) => {
    doc.text(line, 10, y);
    y += lineHeight;
    checkPageBreakk();
    y += 1
  });

  const generalObjectivesText =
    'En razón a los aspectos específicos del área, según lo evaluado, se observa lo siguiente: ' +
    data.generalObjectives;

  const splitSecondText = doc.splitTextToSize(generalObjectivesText, maxWidth);
  splitSecondText.forEach((line: string) => {
    doc.text(line, 10, y);
    y += lineHeight;
    checkPageBreakk();
    y += 1
  });

  const generalFODAText =
    'Se puede señalar  que el paciente: ' + data.generalFODA;

  const splitThirdText = doc.splitTextToSize(generalFODAText, maxWidth);
  splitThirdText.forEach((line: string) => {
    doc.text(line, 10, y);
    y += lineHeight;
    checkPageBreakk();
    y += 1
  });

  y += 4;

  centerHeaders(data.selectedPlanType);

  y += 10;

  doc.setFontSize(10);

  doc.text(`PERÍODO: ${data.secondPeriod} a Diciembre 2023`, 10, y);

  y += 10;

  doc.setFontSize(14);

  doc.text('OBJETIVOS TERAPÉUTICOS', 10, y);

  y += 6;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);

  doc.text(
    'En función de lo evaluado, se proponen los siguientes objetivos específicos de abordaje: ',
    10,
    y
  );

  y += 10;
  checkPageBreakk();

  data.therapeuticObjetives.forEach((objective) => {
    doc.setFont('Helvetica');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`\u2022 ${objective}`, 10, y, { align: 'justify' });
    checkPageBreakk();
    y += spacing;
  });

  y += 10;

  doc.setFontSize(14);
  checkPageBreakk();

  doc.setFont('Helvetica', 'bold');

  doc.text('ESTRATEGIAS DE INTERVENCIÓN', 10, y);

  y += 6;
  checkPageBreakk();

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);

  doc.text(
    'Los objetivos planteados se desarrollaran a partir de las siguientes estrategias de intervención: ',
    10,
    y
  );
  checkPageBreakk();

  y += 10;

  data.therapeuticStrategies.forEach((strat) => {
    doc.setFont('Helvetica');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`\u2022 ${strat}`, 10, y, { align: 'justify' });
    checkPageBreakk();
    y += spacing;
  });

  y += 10;
  checkPageBreakk();
  const signatureWidth = 70;
  const signatureHeight = 30;
  y = checkPageBreak(doc, y, 40);
  if (signatureData)
    doc.addImage(signatureData, 'PNG', 10, y, signatureWidth, signatureHeight);
  doc.text(`${user?.firstName} ${user?.lastName}`, 125, y + 10);

  checkPageBreakk();

  const blobDoc = doc.output('blob');
  const file = new File(
    [blobDoc],
    `${data.selectedPlanType}.pdf`,
    {
      type: 'application/pdf',
    }
  );
  if (patient.data && user) {
    const formData = new FormData();
    formData.append('firstName', patient.data.firstName);
    formData.append('lastName', patient.data.lastName);
    formData.append('userFirstName', user.firstName);
    formData.append('userLastName', user.lastName);
    formData.append('userId', user._id);
    formData.append('report', file as Blob);
    upload.mutate({ id: patient.data._id, form: formData });
  }
};
