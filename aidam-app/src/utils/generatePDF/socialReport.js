import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { centerHeaders, checkPageBreak, inputLine, subtitle, textArea } from '@/utils/jsPDF';
import calculateAge from '@/utils/calculateAge';

const generatePDF = (
  // e: React.FormEvent<HTMLFormElement>,
  // socialFormData: SocialFormData,
  // patient: UseQueryResult<Patient, unknown>,
  // loggedUser: UseQueryResult<User, unknown>,
  // croquisRef: React.RefObject<SignatureCanvas>,
  // firmaRef: React.RefObject<SignatureCanvas>,
  // linkageNetMapRef: React.RefObject<SignatureCanvas>,
  // uploadSoc: UseMutationResult<
  //   Patient,
  //   any,
  //   {
  //     id: string;
  //     form: FormData;
  //   },
  //   unknown
  // >
  e,
  socialFormData,
  patient,
  loggedUser,
  croquisRef,
  firmaRef,
  linkageNetMapRef,
  uploadSoc,
) => {
  e.preventDefault();

  const doc = new jsPDF();

  const lineHeight = 5;
  const spacing = 6;
  const headingFontSize = 14;
  const x = 15;
  let y = 15;

  centerHeaders('FICHA SOCIAL - AIDAM', doc, headingFontSize, y);
  y += spacing;

  y = inputLine(doc, `Fecha de la entrevista: ${socialFormData.date1}`, x, y, spacing);
  y = inputLine(
    doc,
    `Nombre y Apellido del/la concurrente: ${patient.data?.firstName} ${patient.data?.lastName}`,
    x,
    y,
    spacing
  );
  inputLine(doc, `DNI: ${patient.data?.dni}`, x, y, spacing);
  y = inputLine(
    doc,
    `Fecha de nacimiento: ${patient.data?.birth && new Date(patient.data.birth).toLocaleString('es-ES').split(',')[0]}`,
    90,
    y,
    spacing
  );
  y = inputLine(doc, `Edad: ${patient.data?.birth && calculateAge(patient.data.birth)}`, x, y, spacing);
  inputLine(doc, `Obra social: ${patient.data?.socialwork}`, x, y, spacing);
  y = inputLine(doc, `¿Por quién accede a la cobertura?: Madre`, 90, y, spacing);
  y = inputLine(doc, `Domicilio: ${patient.data?.adress}`, x, y, spacing);
  inputLine(doc, `CUD: ${socialFormData.cud.split('.')[0]}`, x, y, spacing);
  if (socialFormData.cud === 'SI')
    y = inputLine(doc, `Próximo vencimiento: ${socialFormData.nextExpiration}`, 90, y, spacing);
  else y += spacing;
  y = inputLine(doc, `Diagnóstico: ${patient.data?.diagnosis}`, x, y, spacing);
  inputLine(doc, `Entrevistado/a: ${socialFormData.interviewed}`, x, y, spacing);
  y = inputLine(doc, `Teléfono: ${socialFormData.phone}`, 90, y, spacing);
  y += 4;

  let croquisData;
  if (croquisRef.current) {
    croquisData = croquisRef.current.toDataURL();
  }
  const croquisWidth = 170;
  const croquisHeight = 70;
  croquisData && doc.addImage(croquisData, 'PNG', x, y, croquisWidth, croquisHeight);
  y += 80;

  y = subtitle(doc, 'Grupo Familiar conviviente:', x, y, 3);
  autoTable(doc, {
    startY: y,
    head: [
      {
        id: '',
        nombre: 'Nombre',
        vinculo: 'Vinculo',
        edad: 'Edad',
        estadoCivil: 'Estado Civil',
        ocupacion: 'Ocupación',
        salud: 'Salud',
        observaciones: 'Observaciones',
      },
    ],
    body: socialFormData.familyGroup.map(familyData => {
      return {
        id: familyData.id,
        nombre: familyData.name,
        vinculo: familyData.relationship,
        edad: familyData.age,
        estadoCivil: familyData.civilState,
        ocupacion: familyData.ocupation,
        salud: familyData.health,
        observaciones: familyData.observations,
      };
    }),
    theme: 'grid',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { textColor: [0, 0, 0] },
  });
  y = doc.lastAutoTable.finalY + 10;

  y = subtitle(doc, 'Red Social y Significativa para el grupo familiar:', x, y, 3);
  autoTable(doc, {
    startY: y,
    head: [
      {
        id: '',
        nombre: 'Nombre',
        vinculo: 'Vinculo',
        edad: 'Edad',
        estadoCivil: 'Estado Civil',
        ocupacion: 'Ocupación',
        observaciones: 'Observaciones',
      },
    ],
    body: socialFormData.socialNetwork.map(familyData => {
      return {
        id: familyData.id,
        nombre: familyData.name,
        vinculo: familyData.relationship,
        edad: familyData.age,
        estadoCivil: familyData.civilState,
        ocupacion: familyData.ocupation,
        observaciones: familyData.observations,
      };
    }),
    theme: 'grid',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { textColor: [0, 0, 0] },
  });
  y = doc.lastAutoTable.finalY + 10;

  y = subtitle(doc, 'Genograma Familiar Vincular:', x, y, spacing);
  y = textArea(doc, socialFormData.familyGenogram, x, y, lineHeight, 5);

  y = subtitle(doc, 'Observaciones:', x, y, spacing);
  y = textArea(
    doc,
    `(Tipo de familia - Características de los vínculos entre los miembros - Temporalidad de los mismos - Roles - Funciones - Otros)`,
    x,
    y,
    lineHeight,
    1
  );
  y = textArea(doc, socialFormData.obsFamilyType, x, y, lineHeight, 5);

  y = subtitle(doc, 'VIVIENDA:', x, y, spacing);
  y = inputLine(doc, `Titular de la vivienda o lote: ${socialFormData.homeOwner} `, x, y, spacing);
  y = subtitle(doc, 'Tenencia:', x, y, spacing, 10);
  inputLine(
    doc,
    `Propietario: ${socialFormData.homePossession === 'Propietario' ? 'X' : ''} `,
    x,
    y,
    spacing,
    undefined,
    undefined,
    true
  );
  inputLine(
    doc,
    `Préstamos: ${socialFormData.homePossession === 'Préstamos' ? 'X' : ''} `,
    x + 50,
    y,
    spacing,
    undefined,
    undefined,
    true
  );
  y = inputLine(
    doc,
    `Ocupante de hecho: ${socialFormData.homePossession === 'Ocupante de hecho' ? 'X' : ''} `,
    x + 100,
    y,
    spacing
  );
  inputLine(
    doc,
    `Inquilino: ${socialFormData.homePossession === 'Inquilino' ? 'X' : ''} `,
    x,
    y,
    spacing,
    undefined,
    undefined,
    true
  );
  inputLine(
    doc,
    `Cesión: ${socialFormData.homePossession === 'Cesión' ? 'X' : ''} `,
    x + 50,
    y,
    spacing,
    undefined,
    undefined,
    true
  );
  y = inputLine(
    doc,
    `Convive con el propietario: ${socialFormData.homePossession === 'Convive con el propietario' ? 'X' : ''} `,
    x + 100,
    y,
    spacing
  );
  y = inputLine(doc, `Otro: ${socialFormData.homePossessionExtra} `, x, y, spacing);

  y = subtitle(doc, 'Materiales:', x, y, spacing, 10);
  y = inputLine(doc, `Paredes: ${socialFormData.wallsMaterial} `, x, y, spacing);
  y = inputLine(doc, `Techos: ${socialFormData.roofMaterial} `, x, y, spacing);
  y = inputLine(doc, `Pisos: ${socialFormData.floorMaterial} `, x, y, spacing);

  y = subtitle(doc, 'Baño:', x, y, spacing, 10);
  y = inputLine(doc, `Cantidad: ${socialFormData.bathAmount} `, x, y, spacing);
  inputLine(
    doc,
    `Con descarga a red pública: ${socialFormData.bathFlushing === 'Con descarga a red pública' ? 'X' : ''} `,
    x,
    y,
    spacing
  );
  inputLine(doc, `Pozo: ${socialFormData.bathFlushing === 'Pozo' ? 'X' : ''} `, x + 70, y, spacing);
  y = inputLine(doc, `Otro: ${socialFormData.bathFlushingExtra} `, x + 100, y, spacing);
  y = inputLine(
    doc,
    `Adaptado a las necesidades del concurrente: ${socialFormData.bathAdapted.split('.')[0]} `,
    x,
    y,
    spacing
  );

  y = subtitle(doc, 'Servicios:', x, y, spacing, 10);
  inputLine(doc, `Luz: ${socialFormData.services.Luz ? 'SI' : 'NO'} `, x, y, spacing, undefined, undefined, true);
  inputLine(
    doc,
    `Agua: ${socialFormData.services.Agua ? 'SI' : 'NO'} `,
    x + 37,
    y,
    spacing,
    undefined,
    undefined,
    true
  );
  inputLine(doc, `Gas: ${socialFormData.services.Gas ? 'SI' : 'NO'} `, x + 75, y, spacing, undefined, undefined, true);
  y = inputLine(doc, `Cloacas: ${socialFormData.services.Cloacas ? 'SI' : 'NO'} `, x + 112, y, spacing);

  inputLine(doc, `N° de dormitorios: ${socialFormData.bedRoomsAmount} `, x, y, spacing, undefined, undefined, true);
  y = inputLine(doc, `¿Cómo y con quién duerme?: ${socialFormData.whereAndWhoSleep}`, x + 80, y, spacing);

  y = subtitle(doc, 'Entorno:', x, y, spacing);
  y = textArea(doc, socialFormData.enviroment, x, y, lineHeight, 5);

  y = subtitle(doc, 'Observaciones:', x, y, spacing);
  y = inputLine(
    doc,
    `(Indicadores de déficit habitacional - Estado de conservación del ambiente, otro)`,
    x,
    y,
    spacing
  );
  y = textArea(doc, socialFormData.obsAmbient, x, y, lineHeight, 5);

  y = subtitle(doc, 'SITUACION ECONÓMICA - LABORAL DE LA FAMILIA', x, y, spacing);
  y = subtitle(doc, 'Seguridad Social', x, y, 3, 10);
  autoTable(doc, {
    startY: y,
    head: [
      {
        assignation: '',
        checked: '',
        whoCollectIt: '¿Quién la cobra?',
        obs: 'Observaciones',
        amount: 'Monto',
      },
    ],
    body: [
      {
        assignation: 'A.U.H',
        checked: socialFormData.socialSecurity.AUH.checked ? 'X' : '',
        whoCollectIt: socialFormData.socialSecurity.AUH.whoCollectsIt,
        obs: socialFormData.socialSecurity.AUH.obs,
        amount: socialFormData.socialSecurity.AUH.amount,
      },
      {
        assignation: 'A.U.H.D',
        checked: socialFormData.socialSecurity.AUHD.checked ? 'X' : '',
        whoCollectIt: socialFormData.socialSecurity.AUHD.whoCollectsIt,
        obs: socialFormData.socialSecurity.AUHD.obs,
        amount: socialFormData.socialSecurity.AUHD.amount,
      },
      {
        assignation: 'S.U.A.F',
        checked: socialFormData.socialSecurity.SUAF.checked ? 'X' : '',
        whoCollectIt: socialFormData.socialSecurity.SUAF.whoCollectsIt,
        obs: socialFormData.socialSecurity.SUAF.obs,
        amount: socialFormData.socialSecurity.SUAF.amount,
      },
      {
        assignation: 'P.N.C',
        checked: socialFormData.socialSecurity.PNC.checked ? 'X' : '',
        whoCollectIt: socialFormData.socialSecurity.PNC.whoCollectsIt,
        obs: socialFormData.socialSecurity.PNC.obs,
        amount: socialFormData.socialSecurity.PNC.amount,
      },
    ],
    theme: 'grid',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      overflow: 'linebreak',
      cellWidth: 'wrap',
    },
    rowPageBreak: 'auto',
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { textColor: [0, 0, 0], valign: 'top' },
    columnStyles: { checked: { halign: 'center' }, obs: { cellWidth: 'auto' } },
  });
  y = doc.lastAutoTable.finalY + 10;

  y = subtitle(doc, 'Situación laboral - Otros ingresos del grupo conviviente', x, y, 3, 10);
  autoTable(doc, {
    startY: y,
    head: [
      {
        nameLink: 'Nombre / Vínculo',
        incomeSource: 'Fuente de ingresos',
        employmentStability: 'Estabilidad laboral',
        daysOfWork: 'Días de trabajo',
        incomeAmount: 'Ingresos aprox.',
      },
    ],
    body: socialFormData.employmentSituation.map(livingPerson => {
      return {
        nameLink: livingPerson.nameLink,
        incomeSource: livingPerson.incomeSource,
        employmentStability: livingPerson.employmentStability,
        daysOfWork: livingPerson.daysOfWork,
        incomeAmount: livingPerson.incomeAmount,
      };
    }),
    theme: 'grid',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { textColor: [0, 0, 0] },
  });
  y = doc.lastAutoTable.finalY + 10;

  y = subtitle(doc, 'Observaciones:', x, y, spacing);
  y = textArea(
    doc,
    `(Evaluación socio - económica en función de egresos familiares y posibilidades de ascenso social-Indicar si la familia ha recibido algún tipo de ayuda social directa por Municipio, Gobierno y/o Nación).`,
    x,
    y,
    lineHeight,
    1
  );
  y = textArea(doc, socialFormData.obsSocioeconomic, x, y, lineHeight, 5);

  y = subtitle(doc, 'Elenco Comunitario:', x, y, spacing);
  y = inputLine(
    doc,
    `(Actividades recreativas o culturales, escolaridad, tratamientos ambulatorios, etc.)`,
    x,
    y,
    spacing
  );
  autoTable(doc, {
    startY: y,
    head: [
      {
        institution: 'Institución',
        referent: 'Referente',
        contact: 'Contacto',
        obs: 'Observaciones',
      },
    ],
    body: socialFormData.comunitaryCast.map(cast => {
      return {
        institution: cast.institution,
        referent: cast.referent,
        contact: cast.contact,
        obs: cast.obs,
      };
    }),
    theme: 'grid',
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { textColor: [0, 0, 0] },
  });
  y = doc.lastAutoTable.finalY + 10;

  y = subtitle(doc, 'Mapa de redes vinculares:', x, y, spacing);
  y = textArea(
    doc,
    `(Se ubican las relaciones más cercanas del concurrente, en distintos niveles y áreas, donde mientras más cercano al centro, más estrecho es el vínculo)`,
    x,
    y,
    lineHeight,
    5
  );
  let linkageNetMapData;
  if (linkageNetMapRef.current) {
    linkageNetMapData = linkageNetMapRef.current.toDataURL();
  }
  const linkageNetMapWidth = 100;
  const linkageNetMapHeight = 100;
  linkageNetMapData && doc.addImage(linkageNetMapData, 'PNG', 50, y, linkageNetMapWidth, linkageNetMapHeight);
  y += 110;

  y = subtitle(doc, 'Observaciones:', x, y, spacing);
  y = textArea(doc, socialFormData.obsLinkageNetMap, x, y, lineHeight, 5);

  y = subtitle(doc, 'PARTICIPACIÓN FAMILIAR:', x, y, spacing);
  y = inputLine(doc, `Comunicación con la Institución: ${socialFormData.comunicWithInstit}`, x, y, spacing);
  y = inputLine(doc, `Asiste a las entrevistas: ${socialFormData.attendsInterviews}`, x, y, 10);

  y = subtitle(doc, 'Observaciones:', x, y, spacing, 10);
  y = textArea(doc, socialFormData.obsFamilyParticipation, x, y, lineHeight, 5);

  y = subtitle(doc, 'RUTINA DEL/LA CONCURRENTE:', x, y, spacing);
  inputLine(
    doc,
    `Tiene cuidador ocasional: ${socialFormData.personalCaretaker.split('.')[0]}`,
    x,
    y,
    spacing,
    undefined,
    undefined,
    true
  );
  if (socialFormData.personalCaretaker === 'SI.personalCaretaker') {
    y = inputLine(doc, `¿Quién?: ${socialFormData.personalCaretakerName}`, x + 60, y, spacing);
  } else y += 6;
  y = inputLine(doc, `¿Por qué?:`, x, y, spacing);
  y = textArea(doc, socialFormData.personalCaretakerWhy, x, y, lineHeight, 5);
  y = inputLine(doc, '¿Quién lo baña?¿Cómo y con qué frecuencia?:', x, y, spacing);
  y = textArea(doc, socialFormData.whoBathedHim, x, y, lineHeight, 5);
  y = inputLine(doc, `Horario de descanso: ${socialFormData.restTime}`, x, y, spacing);
  y = inputLine(doc, `Horario de comida: ${socialFormData.eatTime}`, x, y, spacing);
  y = inputLine(doc, `Horario de medicamento: ${socialFormData.medicsTime}`, x, y, 10);
  y = inputLine(doc, `¿Tiene acceso a alimentos de calidad?:`, x, y, spacing);
  y = textArea(doc, socialFormData.haveAccessQualityFood, x, y, lineHeight, 5);
  y = inputLine(doc, `¿El concurrente comparte el momento de la comida con la familia?:`, x, y, spacing);
  y = textArea(doc, socialFormData.shareEatTimeWithFamily, x, y, lineHeight, 5);
  y = inputLine(
    doc,
    '¿Cómo se organiza la familia al momento de comprar, elaborar y consumir la comida?:',
    x,
    y,
    spacing
  );
  y = textArea(doc, socialFormData.howOrganizeBuyPrepareFood, x, y, lineHeight, 5);
  y = inputLine(doc, 'Comunicación (tipo/barreras):', x, y, spacing);
  y = textArea(doc, socialFormData.comunication, x, y, lineHeight, 5);
  y = inputLine(doc, 'Intereses/gustos del concurrente:', x, y, spacing);
  y = textArea(doc, socialFormData.interests, x, y, lineHeight, 5);
  y = inputLine(doc, 'Expectativas - Qué se espera de la Institución:', x, y, spacing);
  y = textArea(doc, socialFormData.interests, x, y, lineHeight, 5);
  y = inputLine(doc, 'Tratamientos anteriores:', x, y, spacing);
  y = textArea(doc, socialFormData.interests, x, y, lineHeight, 5);
  y = inputLine(doc, 'Barreras en relación a la inclusión:', x, y, spacing);
  y = textArea(doc, socialFormData.interests, x, y, lineHeight, 5);

  y = subtitle(doc, 'Observaciones:', x, y, spacing);
  y = textArea(doc, socialFormData.obsRoutine, x, y, lineHeight, 5);

  y = subtitle(doc, 'CONCLUSIÓN PROFESIONAL:', x, y, spacing);
  y = textArea(
    doc,
    `(Evaluación de indicadores que hacen a la calidad de vida - Red vincular interna - Problemáticas identificadas - Coberturas sociales - Indicadores de negligencia familiar - Necesidad de trabajo interdisciplinario - Redes Interinstitucionales - Otros datos necesarios para el seguimiento de la situación familiar u orientación familiar-Indicadores de vulnerabilidad social)`,
    x,
    y,
    lineHeight,
    5
  );
  y = textArea(doc, socialFormData.professionalConclusion, x, y, lineHeight, 5);

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
  const file = new File([blobDoc], 'Ficha Social.pdf', { type: 'application/pdf' });
  if (patient.data) {
    const formData = new FormData();
    formData.append('firstName', patient.data.firstName);
    formData.append('lastName', patient.data.lastName);
    formData.append('userFirstName', loggedUser.data?.firstName);
    formData.append('userLastName', loggedUser.data?.lastName);
    formData.append('userId', loggedUser.data._id);
    formData.append('report', file);
    uploadSoc.mutate({ id: patient.data._id, form: formData });
  }
};

export default generatePDF;
