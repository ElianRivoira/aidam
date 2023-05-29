import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useMutation, useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';

import Navbar from '@/components/navbar/Navbar';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getOnePatient, uploadMedicalReport } from '@/services/patients';
import {
  TextArea,
  DateInput,
  RadioInput,
  TextInput,
} from '@/components/reports/Inputs';
import { centerHeaders, inputLine, subtitle, textArea } from '@/utils/jsPDF';
import { getLoggedUser } from '@/services/users';
import Modal from '@/components/Modal';
import ArrowBack from '@/components/ArrowBack';
import calculateAge from '@/utils/calculateAge';
import { FisiatricCheck } from '@/components/reports/fisiatricCheck';
import { report } from 'process';
import ReactSignatureCanvas from 'react-signature-canvas';

type setterType = {
  [name: string]: boolean;
};

const createMedical = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [formType, setFormType] = useState('');
  const [cookieError, setCookieError] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [embarazoValues, setEmbarazoValues] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [embarazoOptional, setEmbarazoOptional] = useState('');
  const [partoValues, setPartoValues] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });
  const [recienNacido, setRecienNacido] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
    checkbox7: false,
  });
  const [recienNacidoOptional, setRecienNacidoOptional] = useState('');
  const [hitosDeDesarrollo, setHitosDeDesarrollo] = useState([
    { name: 'Sostén cefálico', value: 0 },
    { name: 'Sedestación', value: 0 },
    { name: 'Bipedestación', value: 0 },
    { name: 'Gateo', value: 0 },
    { name: 'Marcha', value: 0 },
    { name: 'Primeras palabras', value: 0 },
    { name: 'Control esfínteres', value: 0 },
  ]);
  const [complementario, setComplementario] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
  });
  const [cirugia, setCirugia] = useState('');
  const [conducta, setConducta] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
    checkbox7: false,
    checkbox8: false,
    checkbox9: false,
  });
  const [conductaOptional, setConductaOptional] = useState('');
  const [lenguaje, setLenguaje] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
  });
  const [lenguajeOptional, setLenguajeOptional] = useState('');
  const [vision, setVision] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
  });
  const [visionOptional, setVisionOptional] = useState('');
  const [audicion, setAudicion] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [audicionOptional, setAudicionOptional] = useState('');
  const [comprension, setComprension] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });
  const [esfinteres, setEsfinteres] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
  });
  const [alimentacion, setAlimentacion] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [alimentacionOptional, setAlimentacionOptional] = useState('');
  const [sueño, setSueño] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
  });
  const [sueñoOptional, setSueñoOptional] = useState('');
  const [primaria, setPrimaria] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [secundaria, setSecundaria] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [adaptacion, setAdaptacion] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [lectoEscritura, setLectoEscritura] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
  });
  const [obsLectoescritura, setObsLectoescritura] = useState('');
  const [diagEtiologico, setDiagEtiologico] = useState('');
  const [diagFuncional, setDiagFuncional] = useState('');
  const [gmfcs, setGmfcs] = useState('');
  const [marcha, setMarcha] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
  });
  const [equipamiento, setEquipamiento] = useState<setterType>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });
  const [fim, setFim] = useState('');
  const [barthel, setBarthel] = useState('');
  const [otraEscala, setOtraEscala] = useState('');
  const [medActual, setMedActual] = useState('');
  const [inter, setInter] = useState('');
  const [objectives, setObjectives] = useState('');
  const [observations, setObservations] = useState('');
  const signatureRef = useRef<SignatureCanvas>(null);
  //HC
  const [medicalFormData, setMedicalFormData] = useState<MedicalFormData>({
    date1: '',
    motivoConsulta: '',
    antecedentesFamiliares: '',
    oea: '',
    tamizMetabólico: '',
    factoresNegativos: '',
    evaluacionesComplementarias: '',
    alimentacion: '',
    sueño: '',
    motricidadGruesa: '',
    motricidadFina: '',
    controlEsfinteres: '',
    temperamento: '',
    antecedentesPatologicos: '',
    trayectoriaEscolar: '',
    desarrolloSocial: '',
    desarrolloComunicativo: '',
    situacionEstresante: '',
    factoresRiesgo: '',
    peso: '',
    talla: '',
    ta: '',
    imcapt: '',
    perimetroCefalico: '',
    exploracionFisica: '',
    examenesPrevios: '',
    pruebasEstandarizadas: '',
    dateA: '',
    audicion: '',
    dateB: '',
    vision: '',
    dateC: '',
    procesamientoSensorial: '',
    dateD: '',
    evaluacionMotora: '',
    dateE: '',
    dateF: '',
    evalNeurocognitiva: '',
    evalNeurolinguistica: '',
    diagnostico: '',
    sugerenciasTerapeuticas: '',
  });
  const [reportDate, setReportDate] = useState('');

  const handleCheckboxChange = (
    event: any,
    setter: Dispatch<SetStateAction<setterType>>
  ) => {
    const { name, checked } = event.target;
    setter((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));
    console.log(complementario);
  };

  const patient = useQuery({
    queryKey: ['patient', query.id],
    queryFn: () => getOnePatient(query.id),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const loggedUser = useQuery({
    queryKey: ['loggedUser'],
    queryFn: getLoggedUser,
    retry: 1,
    onError: (error) => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

  const uploadMed = useMutation({
    mutationFn: uploadMedicalReport,
    onSuccess: (editedPatient) => {
      setSuccessMsg('Informe médico generado correctamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  useEffect(() => {
    if (type === 2 && !open && cookieError) router.push('/login');
    if (type === 1 && !open) router.push(`/patients/${query.id}/medicsocial`);
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicalFormData({ ...medicalFormData, [name]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalFormData({ ...medicalFormData, [name]: value });
  };

  const handleUpdateValue = (index: number, newValue: any) => {
    let newValueStr = String(newValue);
    newValueStr = newValueStr.slice(0, 2);
    if (isNaN(newValue)) {
      setHitosDeDesarrollo((prevState) => {
        const updatedHitos = [...prevState];
        updatedHitos[index].value = 0;
        return updatedHitos;
      });
    } else {
      setHitosDeDesarrollo((prevState) => {
        const updatedHitos = [...prevState];
        updatedHitos[index].value = parseInt(newValueStr);
        return updatedHitos;
      });
    }
  };

  const renderHitos = () => {
    return hitosDeDesarrollo.map((hito, index) => (
      <div key={index} className='flex gap-1'>
        <span>{hito.name}</span>
        <input
          type='text'
          pattern='[0-9]{0,2}'
          inputMode='numeric'
          value={hito.value}
          onChange={(event) =>
            handleUpdateValue(index, parseInt(event.target.value))
          }
          className='w-5'
        />
      </div>
    ));
  };

  const generatePDF = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const doc = new jsPDF();

    const lineHeight = 5;
    const spacing = 6;
    const headingFontSize = 14;
    const x = 10;
    let y = 10;

    centerHeaders('HISTORIA CLÍNICA - AIDAM', doc, headingFontSize, y);
    y += spacing;

    y = subtitle(
      doc,
      'I - Evaluación de Crecimiento y Desarrollo',
      x,
      y,
      spacing
    );
    y = subtitle(doc, `Fecha: ${medicalFormData.date1}`, x, y, 15);

    y = subtitle(doc, `Identificación`, x, y, spacing);
    y = inputLine(
      doc,
      `Nombre y Apellido: ${patient.data?.firstName} ${patient.data?.lastName}`,
      x,
      y,
      spacing
    );
    y = inputLine(
      doc,
      `Edad: ${patient.data?.birth && calculateAge(patient.data.birth)}`,
      x,
      y,
      spacing
    );
    y = inputLine(
      doc,
      `Fecha de Nacimiento: ${
        patient.data?.birth &&
        new Date(patient.data.birth).toLocaleString().split(',')[0]
      }`,
      x,
      y,
      spacing
    );
    y = inputLine(doc, `DNI: ${patient.data?.dni}`, x, y, spacing);
    y = inputLine(doc, `Obra Social: ${patient.data?.socialwork}`, x, y, 15);

    y = subtitle(
      doc,
      `Informante: ${loggedUser.data?.firstName} ${loggedUser.data?.lastName}`,
      x,
      y,
      15
    );

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
    y = textArea(
      doc,
      medicalFormData.antecedentesFamiliares,
      x,
      y,
      lineHeight,
      5
    );

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
      `Lenguaje expresivo: ${
        medicalFormData.desarrolloComunicativo === 'Lenguaje expresivo'
          ? 'X'
          : ''
      }`,
      x,
      y,
      spacing
    );
    y = inputLine(
      doc,
      `Lenguaje comprensivo: ${
        medicalFormData.desarrolloComunicativo === 'Lenguaje comprensivo'
          ? 'X'
          : ''
      }`,
      x,
      y,
      spacing
    );
    y = inputLine(
      doc,
      `Lenguaje no verbal: ${
        medicalFormData.desarrolloComunicativo === 'Lenguaje no verbal'
          ? 'X'
          : ''
      }`,
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
    y = textArea(
      doc,
      medicalFormData.antecedentesPatologicos,
      x,
      y,
      lineHeight,
      5
    );

    y = subtitle(doc, `Examen físico:`, x, y, spacing);
    y = inputLine(doc, `Peso: ${medicalFormData.peso}`, x, y, spacing);
    y = inputLine(doc, `Talla: ${medicalFormData.talla}`, x, y, spacing);
    y = inputLine(doc, `IMC - A P/T: ${medicalFormData.imcapt}`, x, y, spacing);
    y = inputLine(
      doc,
      `Perímetro cefálico: ${medicalFormData.perimetroCefalico}`,
      x,
      y,
      spacing
    );
    y = inputLine(doc, `TA: ${medicalFormData.ta}`, x, y, spacing);
    y = inputLine(
      doc,
      `Exploración física actual: ${medicalFormData.exploracionFisica}`,
      x,
      y,
      15
    );

    y = subtitle(
      doc,
      `Exámenes, evaluaciones y tratamientos previos:`,
      x,
      y,
      spacing
    );
    y = textArea(doc, medicalFormData.examenesPrevios, x, y, lineHeight, 5);

    y = subtitle(
      doc,
      `Evaluaciones y terapias conductuales o educativas complementarias y/o alternativas:`,
      x,
      y,
      spacing
    );
    y = textArea(
      doc,
      medicalFormData.evaluacionesComplementarias,
      x,
      y,
      lineHeight,
      5
    );

    y = subtitle(
      doc,
      `II - Pruebas de detección estandarizadas:`,
      x,
      y,
      spacing
    );
    y = textArea(
      doc,
      medicalFormData.pruebasEstandarizadas,
      x,
      y,
      lineHeight,
      5
    );

    y = subtitle(doc, `III - Evaluación Sensorio - Motora:`, x, y, spacing);
    y = subtitle(doc, `a) Audición:`, x, y, spacing, 10);
    y = subtitle(doc, `Fecha: ${medicalFormData.dateA}`, x, y, spacing, 10);
    y = textArea(doc, medicalFormData.audicion, x, y, lineHeight, 5);
    y = subtitle(doc, `b) Visión:`, x, y, spacing, 10);
    y = subtitle(doc, `Fecha: ${medicalFormData.dateB}`, x, y, spacing, 10);
    y = textArea(doc, medicalFormData.vision, x, y, lineHeight, 5);
    y = subtitle(doc, `c) Procesamiento sensorial:`, x, y, spacing, 10);
    y = subtitle(doc, `Fecha: ${medicalFormData.dateC}`, x, y, spacing, 10);
    y = textArea(
      doc,
      medicalFormData.procesamientoSensorial,
      x,
      y,
      lineHeight,
      5
    );
    y = subtitle(doc, `d) Evaluación motora:`, x, y, spacing, 10);
    y = subtitle(doc, `Fecha: ${medicalFormData.dateD}`, x, y, spacing, 10);
    y = textArea(doc, medicalFormData.evaluacionMotora, x, y, lineHeight, 5);

    y = subtitle(doc, `IV - Evaluación Neurocognitiva:`, x, y, spacing);
    y = subtitle(doc, `Fecha: ${medicalFormData.dateE}`, x, y, spacing, 10);
    y = textArea(doc, medicalFormData.evalNeurocognitiva, x, y, lineHeight, 5);

    y = subtitle(doc, `V - Evaluación Neurolingüística:`, x, y, spacing);
    y = subtitle(doc, `Fecha: ${medicalFormData.dateF}`, x, y, spacing, 10);
    y = textArea(
      doc,
      medicalFormData.evalNeurolinguistica,
      x,
      y,
      lineHeight,
      5
    );

    y = subtitle(doc, `VI - Diagnóstico:`, x, y, spacing);
    y = textArea(doc, medicalFormData.diagnostico, x, y, lineHeight, 5);

    y = subtitle(doc, `VII - Sugerencias terapéuticas:`, x, y, spacing);
    y = textArea(
      doc,
      medicalFormData.sugerenciasTerapeuticas,
      x,
      y,
      lineHeight,
      5
    );

    const blobDoc = doc.output('blob');
    const file = new File([blobDoc], 'Historia clinica fisiatrica.pdf', {
      type: 'application/pdf',
    });
    if (patient.data) {
      const formData = new FormData();
      formData.append('firstName', patient.data.firstName);
      formData.append('lastName', patient.data.lastName);
      formData.append('report', file as Blob);
      uploadMed.mutate({ id: patient.data._id, form: formData });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let birthDate;
    let day, month, year;
    let age;
    let currentDate = new Date();
    let signatureData;
    if (signatureRef.current) {
      signatureData = signatureRef.current.toDataURL();
    }
    if (patient.data?.birth) {
      birthDate = new Date(patient.data?.birth);
      birthDate = birthDate.toLocaleString().split(',');
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
    doc.setFont('Arial');
    doc.setFontSize(10);
    const lineHeight = 10;
    const spacing = 6;
    const headingFontSize = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const tagWidth = 80;
    const auxiliarWidth = 100;
    let x = 10;

    function checkPageBreak() {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y > pageHeight - lineHeight) {
        doc.addPage();
        y = 10;
      }
    }

    function generateCheck(arr: Array<string>, obj: any) {
      arr.forEach((tag, index) => {
        if (x + tagWidth >= pageWidth) {
          y += 10;
          x = 10;
        }
        checkPageBreak();
        let result = 'No';
        let currentProperty = obj[`checkbox${index + 1}`];
        if (currentProperty) result = 'Si';
        doc.text(`${tag}: ${result}`, x, y);

        x += tagWidth;
      });
    }

    function centerHeaders(text: string) {
      const headingText = text;
      const headingFontWidth =
        (doc.getStringUnitWidth(headingText) * headingFontSize) /
        doc.internal.scaleFactor;
      const headingX =
        (doc.internal.pageSize.getWidth() - headingFontWidth) / 2;
      doc.setFont('Arial', 'bold');
      doc.setFontSize(headingFontSize);
      doc.text(headingText, headingX, y);
    }

    centerHeaders('HISTORIA CLÍNICA FISIÁTRICA');
    doc.setFont('Arial', 'normal');
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
    doc.text(`Fecha de evaluación: ${reportDate}`, 10, y);
    y += 10;
    centerHeaders('ANTECEDENTES MATERNOS');
    y += 10;
    doc.text(`Embarazo:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(['A término', 'Prematuro', 'Controlado'], embarazoValues);
    x = 10;
    y += 10;
    doc.text(`Patologias: ${embarazoOptional}`, 10, y);
    doc.setFont('Arial', 'bold');
    y += 10;
    doc.text(`Parto:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      ['Espontaneo', 'Inducido', 'Cesarea', 'Fórceps'],
      partoValues
    );
    x = 10;
    y += 10;
    centerHeaders('CARACTERISTICAS RECIEN  NACIDO');
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      [
        'Prematuro',
        'A Término',
        'Gemelar',
        'Fórceps',
        'Incubadora',
        'Ictericia',
        'Convulsiones',
      ],
      recienNacido
    );
    y += 10;
    doc.text(`Otros: ${recienNacidoOptional}`, 10, y);
    y += 10;
    centerHeaders('CARACTERISTICAS DEL DESARROLLO');
    y += 10;
    x = 10;
    doc.setFont('Arial', 'normal');
    hitosDeDesarrollo.forEach((hito) => {
      if (x + auxiliarWidth > pageWidth) {
        y += 10;
        x = 10;
      }
      checkPageBreak();

      doc.text(`${hito.name}: ${hito.value} meses`, x, y);

      x += auxiliarWidth;
    });

    y += 10;
    centerHeaders('ESTUDIOS COMPLEMENTARIOS');
    y += 10;
    x = 10;
    doc.setFont('Arial', 'normal');
    generateCheck(['RMN', 'RX', 'TAC', 'PEV', 'OEA', 'PEA'], complementario);
    y += 10;
    x = 10;
    checkPageBreak();
    doc.text(`CIRUGÏAS: ${cirugia}`, 10, y);
    y += 10;
    centerHeaders('ESTADO ACTUAL');
    y += 10;
    doc.text(`Conducta:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
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
      conducta
    );
    x = 10;
    y += 10;
    doc.text(`Otros: ${conductaOptional}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Lenguaje:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      [
        'Adecuado a la edad',
        'Infantil',
        'Dislalias',
        'Disartria',
        'Pobre',
        'No habla',
      ],
      lenguaje
    );
    x = 10;
    y += 10;
    doc.text(`Otros: ${lenguajeOptional}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Visión:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      [
        'Normal',
        'Usa lentes',
        'Ceguera',
        'Retinopatía',
        'Estrabismo',
        'Cataratas',
      ],
      vision
    );
    x = 10;
    y += 10;
    doc.text(`Otros: ${visionOptional}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Audición:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(['Normal', 'Hipoacusia', 'Audífonos'], audicion);
    x = 10;
    y += 10;
    doc.text(`Otros: ${audicionOptional}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Comprensión:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      [
        'Adecuada a la edad:',
        'Limitada',
        'Responde a consignas elementales',
        'No responde a consignas elementales',
      ],
      comprension
    );
    x = 10;
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Control de esfínteres:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      [
        'Vesical total',
        'Parcial',
        'No controla',
        'Anal total',
        'Parcial',
        'No controla',
      ],
      esfinteres
    );
    x = 10;
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Alimentación:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(
      ['Conservada', 'Sonda nasogástrica', 'Gastrostomía'],
      alimentacion
    );
    x = 10;
    y += 10;
    doc.text(`Otros: ${alimentacionOptional}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Patrones de sueño:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    generateCheck(['Conservado', 'Insomnio'], sueño);
    x = 10;
    y += 10;
    doc.text(`Otros: ${sueñoOptional}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`Escolaridad:`, 10, y);
    doc.setFont('Arial', 'normal');
    y += 10;
    doc.text(`Primaria:`, 10, y);
    y += 10;
    generateCheck(['Común', 'Integrada', 'Domiciliaria'], primaria);
    x = 10;
    y += 10;
    doc.text(`Secundaria:`, 10, y);
    y += 10;
    generateCheck(['Común', 'Integrada', 'Domiciliaria'], secundaria);
    x = 10;
    y += 10;
    doc.text(`Adaptación:`, 10, y);
    y += 10;
    generateCheck(['Buena', 'Regular', 'Mala'], adaptacion);
    x = 10;
    y += 10;
    doc.text(`Lectoescritura:`, 10, y);
    y += 10;
    generateCheck(['Si', 'No'], lectoEscritura);
    x = 10;
    y += 10;
    doc.text(`Observaciones: ${obsLectoescritura}`, 10, y);
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`DIAGNÓSTICO ETIOLÓGICO:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    const maxWidth = 180;

    const diagSplitText = doc.splitTextToSize(diagEtiologico, maxWidth);

    diagSplitText.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });

    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`DIAGNÓSTICO FUNCIONAL:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');

    const diagFuncSplit = doc.splitTextToSize(diagFuncional, maxWidth);

    diagFuncSplit.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });

    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`ASPECTO MOTOR:`, 10, y);

    checkPageBreak();

    y += 10;
    doc.text(`GMFCS:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');

    const gmfcsSplit = doc.splitTextToSize(gmfcs, maxWidth);

    gmfcsSplit.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });

    y += 10;
    checkPageBreak();
    doc.setFont('Arial', 'bold');
    doc.text(`MARCHA:`, 10, y);
    doc.setFont('Arial', 'normal');
    y += 10;
    generateCheck(['Independiente', 'Dependiente'], marcha);
    x = 10;
    y += 10;
    checkPageBreak();
    doc.setFont('Arial', 'bold');
    doc.text(`EQUIPAMIENTO:`, 10, y);
    doc.setFont('Arial', 'normal');
    y += 10;
    generateCheck(
      ['Ortesis', 'Bastones', 'Andador', 'Silla de ruedas'],
      equipamiento
    );
    x = 10;
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`HABITOS DE LA VIDA DÍARIA (AVD):`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');
    doc.text(
      `ESCALA FIM: ${fim}  ESCALA BARTHEL: ${barthel}  OTROS: ${otraEscala}`,
      10,
      y
    );
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`MEDICACIÓN ACTUAL:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');

    const medActualSplit = doc.splitTextToSize(medActual, maxWidth);

    medActualSplit.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });

    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`INTERCONSULTAS:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');

    const interSplit = doc.splitTextToSize(inter, maxWidth);

    interSplit.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });
    y += 10;
    checkPageBreak();
    centerHeaders('PLAN TERAPÉUTICO');
    checkPageBreak();
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`OBJETIVOS:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');

    const objSplit = doc.splitTextToSize(objectives, maxWidth);

    objSplit.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });
    y += 10;
    doc.setFont('Arial', 'bold');
    doc.text(`OBSERVACIONES:`, 10, y);
    y += 10;
    doc.setFont('Arial', 'normal');

    const obsSplit = doc.splitTextToSize(observations, maxWidth);

    obsSplit.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      checkPageBreak();
    });
    checkPageBreak();
    const signatureWidth = 70;
    const signatureHeight = 30;
    if (signatureData)
      doc.addImage(
        signatureData,
        'PNG',
        10,
        y,
        signatureWidth,
        signatureHeight
      );
    doc.text(
      `${loggedUser.data?.firstName} ${loggedUser.data?.lastName}`,
      125,
      y + 10
    );

    const blobDoc = doc.output('blob');
    const file = new File([blobDoc], 'Historia clinica fisiatrica.pdf', {
      type: 'application/pdf',
    });
    if (patient.data) {
      const formData = new FormData();
      formData.append('firstName', patient.data.firstName);
      formData.append('lastName', patient.data.lastName);
      formData.append('report', file as Blob);
      uploadMed.mutate({ id: patient.data._id, form: formData });
    }
  };

  return (
    <>
      <Head>
        <title>{`AIDAM - Generar informe médico`}</title>
      </Head>
      <main className='flex flex-col items-center min-h-screen bg-background'>
        {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />}
        <div className='w-full lg:px-12 lg:mt-2.5'>
          <NavbarPatient />
          <div className='flex flex-col lgMax:px-4'>
            <div className='flex justify-between items-center my-7 w-full'>
              <div className='flex items-center gap-8'>
                <ArrowBack route={`/patients/${query.id}/medicsocial`} />
                <h2 className='text-xg font-medium'>
                  {patient.data?.firstName} {patient.data?.lastName}
                </h2>
              </div>
              <h1 className='text-xl2 font-medium'>GENERAR INFORME</h1>
            </div>
            <hr className='border-black03 w-full' />
            <h1 className='text-xl2.5 font-medium mt-7 mb-8 text-center'>
              INFORME MÉDICO
            </h1>
            <div className='flex flex-col self-center mb-5'>
              <label htmlFor='selectForm' className='text-ln'>
                Seleccione el tipo de informe
              </label>
              <select
                name='selectForm'
                id='selectForm'
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className='outline-none border border-black02 hover:border-aidam80 transition-colors rounded-md p-1 mt-1'
              >
                <option value='' hidden></option>
                <option value='hcFisiatrica'>
                  Historia clínica fisiátrica
                </option>
                <option value='hc'>Historia clínica</option>
              </select>
            </div>
            {formType === 'hc' ? (
              <form onSubmit={generatePDF}>
                <h3 className='text-xb font-medium'>
                  I - Evaluación de Crecimiento y Desarrollo
                </h3>
                <div className='flex mt-6'>
                  <div className='w-1/3 px-4'>
                    <DateInput
                      label='Fecha:'
                      name='date1'
                      divclass='mb-8'
                      value={medicalFormData.date1}
                      onChange={handleInputChange}
                    />
                    <TextArea
                      label='Motivo de consulta:'
                      name='motivoConsulta'
                      placeholder='Ingrese el motivo de su consulta'
                      divclass='mb-4'
                      value={medicalFormData.motivoConsulta}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Antecedentes familiares:'
                      name='antecedentesFamiliares'
                      placeholder='Ingrese sus antecedentes familiares'
                      divclass='mb-4'
                      value={medicalFormData.antecedentesFamiliares}
                      onChange={handleTextAreaChange}
                    />
                    <label className='text-ln font-medium block mb-3'>
                      Antecedentes de embarazo y perinatales:
                    </label>
                    <TextArea
                      label='OEA:'
                      name='oea'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.oea}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Tamiz metabólico:'
                      name='tamizMetabólico'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.tamizMetabólico}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Factores pronósticos negativos:'
                      name='factoresNegativos'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.factoresNegativos}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Evaluaciones y terapias conductuales o educativas complementarias y/o alternativas:'
                      name='evaluacionesComplementarias'
                      divclass='mb-2'
                      placeholder='Ingrese las evalueaciones y terapias complementarias'
                      value={medicalFormData.evaluacionesComplementarias}
                      onChange={handleTextAreaChange}
                    />
                  </div>
                  <div className='w-1/3 px-4'>
                    <label className='text-ln font-medium block mb-3'>
                      Desarrollo psicomotor:
                    </label>
                    <TextArea
                      label='Alimentación:'
                      name='alimentacion'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.alimentacion}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Sueño:'
                      name='sueño'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.sueño}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Motricidad gruesa:'
                      name='motricidadGruesa'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.motricidadGruesa}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Motricidad fina:'
                      name='motricidadFina'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.motricidadFina}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Control de esfínteres:'
                      name='controlEsfinteres'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.controlEsfinteres}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Temperamento:'
                      name='temperamento'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={1}
                      value={medicalFormData.temperamento}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Antecedentes patológicos personales:'
                      name='antecedentesPatologicos'
                      divclass='mb-2'
                      placeholder='Ingrese los antecedentes patológicos del paciente'
                      value={medicalFormData.antecedentesPatologicos}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Trayectoria escolar:'
                      name='trayectoriaEscolar'
                      placeholder='Funcionamiento escolar global'
                      divclass='mb-4'
                      minRows={7}
                      value={medicalFormData.trayectoriaEscolar}
                      onChange={handleTextAreaChange}
                    />
                  </div>
                  <div className='w-1/3 px-4'>
                    <TextArea
                      label='Desarrollo social:'
                      name='desarrolloSocial'
                      divclass='mb-4'
                      minRows={6}
                      value={medicalFormData.desarrolloSocial}
                      onChange={handleTextAreaChange}
                    />
                    <RadioInput
                      label='Desarrollo comunicativo:'
                      name='desarrolloComunicativo'
                      optionsArray={[
                        'Lenguaje expresivo',
                        'Lenguaje comprensivo',
                        'Lenguaje no verbal',
                      ]}
                      divclass='mb-4'
                      value={medicalFormData.desarrolloComunicativo}
                      onChange={handleInputChange}
                    />
                    <label className='text-ln font-medium block mb-3'>
                      Antecedentes conductuales:
                    </label>
                    <TextArea
                      label='Situación estresante en último año:'
                      name='situacionEstresante'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={2}
                      value={medicalFormData.situacionEstresante}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Factores de riesgo identificados:'
                      name='factoresRiesgo'
                      divclass='mb-2'
                      labelclass='font-normal text-lm'
                      minRows={2}
                      value={medicalFormData.factoresRiesgo}
                      onChange={handleTextAreaChange}
                    />
                    <label className='text-ln font-medium block mb-3'>
                      Examen físico:
                    </label>
                    <div className='flex gap-2'>
                      <TextInput
                        label='Peso:'
                        divclass='mb-2'
                        name='peso'
                        value={medicalFormData.peso}
                        onChange={handleInputChange}
                      />
                      <TextInput
                        label='Talla:'
                        divclass='mb-2'
                        name='talla'
                        value={medicalFormData.talla}
                        onChange={handleInputChange}
                      />
                      <TextInput
                        label='TA:'
                        divclass='mb-2'
                        name='ta'
                        value={medicalFormData.ta}
                        onChange={handleInputChange}
                      />
                    </div>
                    <TextInput
                      label='IMC - A P/T:'
                      divclass='mb-2'
                      name='imcapt'
                      value={medicalFormData.imcapt}
                      onChange={handleInputChange}
                    />
                    <TextInput
                      label='Perímetro cefálico:'
                      divclass='mb-2'
                      name='perimetroCefalico'
                      value={medicalFormData.perimetroCefalico}
                      onChange={handleInputChange}
                    />
                    <TextInput
                      label='Exploración física actual:'
                      divclass='mb-2'
                      name='exploracionFisica'
                      value={medicalFormData.exploracionFisica}
                      onChange={handleInputChange}
                    />
                    <TextArea
                      label='Exámenes, evaluaciones y tratamientos previos:'
                      name='examenesPrevios'
                      divclass='mb-2'
                      value={medicalFormData.examenesPrevios}
                      onChange={handleTextAreaChange}
                    />
                  </div>
                </div>
                <div className='w-2/3 mt-3'>
                  <h3 className='text-xb font-medium'>
                    II - Pruebas de detección estandarizadas:
                  </h3>
                  <TextArea
                    name='pruebasEstandarizadas'
                    divclass='mb-2'
                    value={medicalFormData.pruebasEstandarizadas}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 mt-3 flex flex-col'>
                  <h3 className='text-xb font-medium'>
                    III - Evaluación Sensorio - Motora:
                  </h3>
                  <DateInput
                    name='dateA'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateA}
                    onChange={handleInputChange}
                  />
                  <TextArea
                    label='a) Audición:'
                    name='audicion'
                    divclass='mb-2'
                    value={medicalFormData.audicion}
                    onChange={handleTextAreaChange}
                  />
                  <DateInput
                    name='dateB'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateB}
                    onChange={handleInputChange}
                  />
                  <TextArea
                    label='b) Visión:'
                    name='vision'
                    divclass='mb-2'
                    value={medicalFormData.vision}
                    onChange={handleTextAreaChange}
                  />
                  <DateInput
                    name='dateC'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateC}
                    onChange={handleInputChange}
                  />
                  <TextArea
                    label='c) Procesamiento sensorial:'
                    name='procesamientoSensorial'
                    divclass='mb-2'
                    value={medicalFormData.procesamientoSensorial}
                    onChange={handleTextAreaChange}
                  />
                  <DateInput
                    name='dateD'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateD}
                    onChange={handleInputChange}
                  />
                  <TextArea
                    label='d) Evaluación motora:'
                    name='evaluacionMotora'
                    divclass='mb-2'
                    value={medicalFormData.evaluacionMotora}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 mt-3 flex flex-col'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-xb font-medium'>
                      IV - Evaluación Neurocognitiva:
                    </h3>
                    <DateInput
                      name='dateE'
                      label='Fecha:'
                      divclass='self-end'
                      value={medicalFormData.dateE}
                      onChange={handleInputChange}
                    />
                  </div>
                  <TextArea
                    name='evalNeurocognitiva'
                    divclass='mb-2'
                    value={medicalFormData.evalNeurocognitiva}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 mt-3 flex flex-col'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-xb font-medium'>
                      V - Evaluación Neurolingüística:
                    </h3>
                    <DateInput
                      name='dateF'
                      label='Fecha:'
                      divclass='self-end'
                      value={medicalFormData.dateF}
                      onChange={handleInputChange}
                    />
                  </div>
                  <TextArea
                    name='evalNeurolinguistica'
                    divclass='mb-2'
                    value={medicalFormData.evalNeurolinguistica}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 mt-3 flex flex-col'>
                  <h3 className='text-xb font-medium'>VI - Diagnóstico:</h3>
                  <TextArea
                    name='diagnostico'
                    divclass='mb-2'
                    value={medicalFormData.diagnostico}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 mt-3 flex flex-col'>
                  <h3 className='text-xb font-medium'>
                    VII - Sugerencias terapéuticas:
                  </h3>
                  <TextArea
                    name='sugerenciasTerapeuticas'
                    divclass='mb-2'
                    value={medicalFormData.sugerenciasTerapeuticas}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='flex justify-end my-4'>
                  <button
                    type='submit'
                    className='flex items-center text-lm font-medium p-2.5 text-white rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                  >
                    Generar Informe
                  </button>
                </div>
              </form>
            ) : formType === 'hcFisiatrica' ? (
              <form className='flex flex-col gap-3' onSubmit={handleFormSubmit}>
                <div>
                  <label className='font-medium' htmlFor='fecha'>
                    Fecha:{' '}
                  </label>
                  <input
                    value={reportDate}
                    required
                    type='date'
                    className='border focus:border-none focus:outline-none'
                    id='fecha'
                    onChange={(e) => setReportDate(e.target.value)}
                  />
                </div>
                <h3 className='text-xb font-medium'>ANTECEDENTES MATERNOS:</h3>
                <FisiatricCheck
                  onChangeCheck={(e) =>
                    handleCheckboxChange(e, setEmbarazoValues)
                  }
                  booleanObject={embarazoValues}
                  array={['A término', 'Prematuro', 'Controlado']}
                  valueSetter={setEmbarazoOptional}
                  title='Embarazo'
                  inputText='Patologías'
                  placeholder='Indique aquí si tuvo alguna/s patología/s'
                />
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setPartoValues)}
                  booleanObject={partoValues}
                  array={['Espontaneo', 'Inducido', 'Cesarea', 'Fórceps']}
                  title='Parto'
                />
                <h3 className='text-xb font-medium'>
                  CARACTERÍSTICAS RECIÉN NACIDO:
                </h3>
                <FisiatricCheck
                  onChangeCheck={(e) =>
                    handleCheckboxChange(e, setRecienNacido)
                  }
                  booleanObject={recienNacido}
                  array={[
                    'Prematuro',
                    'A Término',
                    'Gemelar',
                    'Fórceps',
                    'Incubadora',
                    'Ictericia',
                    'Convulsiones',
                  ]}
                  valueSetter={setRecienNacidoOptional}
                  placeholder='Indique aquí si tuvo alguna otra característica/s'
                  inputText='Otros'
                />
                <h3 className='text-xb font-medium'>
                  CARACTERÍSTICAS DEL DESARROLLO:
                </h3>
                <h4 className='text-xs italic'>{`(Coloque la cantidad de meses)`}</h4>
                <div className='flex gap-4 w-2/3'>
                  <div className='flex gap-3 flex-wrap'>{renderHitos()}</div>
                </div>
                <h3 className='text-xb font-medium'>
                  ESTUDIOS COMPLEMENTARIOS:
                </h3>
                <FisiatricCheck
                  onChangeCheck={(e) =>
                    handleCheckboxChange(e, setComplementario)
                  }
                  booleanObject={complementario}
                  array={['RMN', 'RX', 'TAC', 'PEV', 'OEA', 'PEA']}
                />
                <label htmlFor='cirugia' className='font-medium'>
                  CIRUGÍAS:
                  <input
                    type='text'
                    value={cirugia}
                    className='ml-1 px-1 w-[350px]'
                    onChange={(e) => setCirugia(e.target.value)}
                  />
                </label>
                <h3 className='text-xb font-medium'>ESTADO ACTUAL:</h3>
                <h5 className='font-medium'>Conducta:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setConducta)}
                  booleanObject={conducta}
                  array={[
                    'Adecuada',
                    'Impulsiva',
                    'Indiferencia al medio',
                    'Autoagresivo',
                    'Heteroagresivo',
                    'Inquietud motora',
                    'Estereotipias',
                    'Aislamiento',
                    'Negativismo',
                  ]}
                  valueSetter={setConductaOptional}
                  placeholder='Indique aquí si tuvo alguna otra conducta'
                  inputText='Otros'
                />
                <h5 className='font-medium'>Lenguaje:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setLenguaje)}
                  booleanObject={lenguaje}
                  array={[
                    'Adecuado a la edad',
                    'Infantil',
                    'Dislalias',
                    'Disartria',
                    'Pobre',
                    'No habla',
                  ]}
                  valueSetter={setLenguajeOptional}
                  placeholder='Indique aquí si existe otro tipo de lenguaje'
                  inputText='Otros'
                />
                <h5 className='font-medium'>Visión:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setVision)}
                  booleanObject={vision}
                  array={[
                    'Normal',
                    'Usa lentes',
                    'Ceguera',
                    'Retinopatía',
                    'Estrabismo',
                    'Cataratas',
                  ]}
                  valueSetter={setVisionOptional}
                  placeholder='Indique aquí si existe otro tipo de visión'
                  inputText='Otros'
                />
                <h5 className='font-medium'>Audición:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setAudicion)}
                  booleanObject={audicion}
                  array={['Normal', 'Hipoacusia', 'Audífonos']}
                  valueSetter={setAudicionOptional}
                  placeholder='Indique aquí si existe otro tipo de audición'
                  inputText='Otros'
                />
                <h5 className='font-medium'>Comprensión:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setComprension)}
                  booleanObject={comprension}
                  array={[
                    'Adecuada a la edad:',
                    'Limitada',
                    'Responde a consignas elementales',
                    'No responde a consignas elementales',
                  ]}
                />
                <h5 className='font-medium'>Control de esfínteres:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setEsfinteres)}
                  booleanObject={esfinteres}
                  array={[
                    'Vesical total',
                    'Parcial',
                    'No controla',
                    'Anal total',
                    'Parcial',
                    'No controla',
                  ]}
                />
                <h5 className='font-medium'>Alimentación:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) =>
                    handleCheckboxChange(e, setAlimentacion)
                  }
                  booleanObject={alimentacion}
                  array={['Conservada', 'Sonda nasogástrica', 'Gastrostomía']}
                  valueSetter={setAlimentacionOptional}
                  placeholder='Indique aquí si existe otro tipo de alimentación'
                  inputText='Otros'
                />
                <h5 className='font-medium'>Patrones de sueño:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setSueño)}
                  booleanObject={sueño}
                  array={['Conservado', 'Insomnio']}
                  valueSetter={setSueñoOptional}
                  placeholder='Indique aquí si existe otro tipo de patrones'
                  inputText='Otros'
                />
                <h5 className='font-medium'>Escolaridad:</h5>
                <h5>Primaria:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setPrimaria)}
                  booleanObject={primaria}
                  array={['Común', 'Integrada', 'Domiciliaria']}
                />
                <h5>Secundaria:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setSecundaria)}
                  booleanObject={secundaria}
                  array={['Común', 'Integrada', 'Domiciliaria']}
                />
                <h5>Adaptación:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setAdaptacion)}
                  booleanObject={adaptacion}
                  array={['Buena', 'Regular', 'Mala']}
                />
                <h5>Lectoescritura:</h5>
                <FisiatricCheck
                  onChangeCheck={(e) =>
                    handleCheckboxChange(e, setLectoEscritura)
                  }
                  booleanObject={lectoEscritura}
                  array={['Si', 'No']}
                />
                <label htmlFor='obsLectoEscritura'>
                  <input
                    type='text'
                    name='obsLectoEscritura'
                    id='obsLectoEscritura'
                    placeholder='Ingrese observación'
                    className='px-1 w-1/3'
                    onChange={(e) => setObsLectoescritura(e.target.value)}
                  />
                </label>
                <label htmlFor='diagEtiologico' className='font-medium'>
                  DIAGNÓSTICO ETIOLÓGICO:
                  <input
                    type='text'
                    placeholder='Ingrese diagnóstico'
                    value={diagEtiologico}
                    className='ml-1 px-1 w-2/3'
                    onChange={(e) => setDiagEtiologico(e.target.value)}
                  />
                </label>
                <label htmlFor='diagFuncional' className='font-medium'>
                  DIAGNÓSTICO FUNCIONAL:
                  <input
                    type='text'
                    placeholder='Ingrese diagnóstico'
                    value={diagFuncional}
                    className='ml-1 px-1 w-2/3'
                    onChange={(e) => setDiagFuncional(e.target.value)}
                  />
                </label>
                <h3 className='text-xb font-medium'>ASPECTO MOTOR:</h3>
                <label htmlFor='gmfcs' className='font-medium'>
                  GMFCS:
                  <input
                    type='text'
                    placeholder='Ingrese GMFCS'
                    value={gmfcs}
                    className='ml-1 px-1 w-[350px]'
                    onChange={(e) => setGmfcs(e.target.value)}
                  />
                </label>
                <h3 className='text-xb font-medium'>MARCHA:</h3>
                <FisiatricCheck
                  onChangeCheck={(e) => handleCheckboxChange(e, setMarcha)}
                  booleanObject={marcha}
                  array={['Independiente', 'Dependiente']}
                />
                <h3 className='text-xb font-medium'>EQUIPAMIENTO:</h3>
                <FisiatricCheck
                  onChangeCheck={(e) =>
                    handleCheckboxChange(e, setEquipamiento)
                  }
                  booleanObject={equipamiento}
                  array={['Ortesis', 'Bastones', 'Andador', 'Silla de ruedas']}
                />
                <h3 className='text-xb font-medium'>
                  HABITOS DE LA VIDA DIARIA (AVD):
                </h3>
                <div className='flex flex-wrap gap-4'>
                  <label htmlFor='fim' className='font-medium'>
                    ESCALA FIM:
                  </label>
                  <input
                    type='text'
                    placeholder='Ingrese escala FIM'
                    value={fim}
                    className='ml-1 px-1 w-[200px]'
                    onChange={(e) => setFim(e.target.value)}
                  />
                  <label htmlFor='barthel' className='font-medium'>
                    ESCALA BARTHEL:
                    <input
                      type='text'
                      placeholder='Ingrese escala BARTHEL'
                      value={barthel}
                      className='ml-1 px-1 w-[200px]'
                      onChange={(e) => setBarthel(e.target.value)}
                    />
                  </label>
                  <label htmlFor='otraEscala' className='font-medium'>
                    OTROS:
                    <input
                      type='text'
                      placeholder='Ingrese otros'
                      value={otraEscala}
                      className='ml-1 px-1 w-[200px]'
                      onChange={(e) => setOtraEscala(e.target.value)}
                    />
                  </label>
                </div>
                <label htmlFor='medActual' className='font-medium w-full'>
                  MEDICACIÓN ACTUAL:
                  <input
                    type='text'
                    placeholder='Ingrese medicación'
                    value={medActual}
                    className='ml-1 px-1 w-[350px]'
                    onChange={(e) => setMedActual(e.target.value)}
                  />
                </label>
                <label htmlFor='interconsultas' className='font-medium w-full'>
                  INTERCONSULTAS:
                  <input
                    type='text'
                    placeholder='Ingrese interconsultas'
                    value={inter}
                    className='ml-1 px-1 w-[350px]'
                    onChange={(e) => setInter(e.target.value)}
                  />
                </label>

                <h3 className='text-xb font-medium'>PLAN TERAPÉUTICO</h3>
                <label htmlFor='objetivos' className='font-medium w-full'>
                  OBJETIVOS:
                  <input
                    type='text'
                    placeholder='Ingrese medicación'
                    value={objectives}
                    className='ml-1 px-1 w-[350px]'
                    onChange={(e) => setObjectives(e.target.value)}
                  />
                </label>
                <label htmlFor='observaciones' className='font-medium w-full'>
                  OBSERVACIONES:
                  <input
                    type='text'
                    placeholder='Ingrese medicación'
                    value={observations}
                    className='ml-1 px-1 w-[350px]'
                    onChange={(e) => setObservations(e.target.value)}
                  />
                </label>
                <div className='flex flex-col mt-10'>
                  <p>Firma:</p>
                  <div className='border w-fit border-rose-400'>
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        width: 300,
                        height: 100,
                        className: 'signature-canvas',
                      }}
                    />
                  </div>
                </div>

                <div className='flex justify-end my-4'>
                  <button
                    type='submit'
                    className='flex items-center text-lm font-medium p-2.5 text-white rounded-md bg-aidam80 hover:bg-aidam70 transition-colors'
                  >
                    Generar Informe
                  </button>
                </div>
              </form>
            ) : (
              ''
            )}
          </div>
        </div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          type={type}
          errors={errors}
        >
          <h1>{successMsg}</h1>
        </Modal>
      </main>
    </>
  );
};

export default createMedical;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

createMedical.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
