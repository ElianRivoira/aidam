import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';

import Navbar from '@/components/navbar/Navbar';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import NavbarPatient from '@/components/profile/patient/NavbarPatient';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getOnePatient } from '@/services/patients';
import { TextArea, DateInput, RadioInput, TextInput } from '@/components/reports/Inputs';
import { centerHeaders, inputLine, subtitle, textArea } from '@/utils/jsPDF';
import { getLoggedUser } from '@/services/users';
import Modal from '@/components/Modal';
import ArrowBack from '@/components/ArrowBack';
import calculateAge from '@/utils/calculateAge';

const createMedical = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [formType, setFormType] = useState('');
  const [cookieError, setCookieError] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
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
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

  useEffect(() => {
    if (type === 2 && !open && cookieError) router.push('/login');
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicalFormData({ ...medicalFormData, [name]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalFormData({ ...medicalFormData, [name]: value });
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

    doc.save('HC-AIDAM.pdf');
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
            <h1 className='text-xl2.5 font-medium mt-7 mb-8 text-center'>INFORME MÉDICO</h1>
            <div className='flex flex-col self-center mb-5'>
              <label htmlFor='selectForm' className='text-ln'>
                Seleccione el tipo de informe
              </label>
              <select
                name='selectForm'
                id='selectForm'
                value={formType}
                onChange={e => setFormType(e.target.value)}
                className='outline-none border border-black02 hover:border-aidam80 transition-colors rounded-md p-1 mt-1'
              >
                <option value='' hidden></option>
                <option value='hc'>Historia clínica</option>
                <option value='hcFisiatrica'>Historia clínica fisiátrica</option>
              </select>
            </div>
            {formType === 'hcFisiatrica' ? (
              <form onSubmit={generatePDF}>
                <h3 className='text-xb font-medium'>I - Evaluación de Crecimiento y Desarrollo</h3>
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
                    <label className='text-ln font-medium block mb-3'>Antecedentes de embarazo y perinatales:</label>
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
                    <label className='text-ln font-medium block mb-3'>Desarrollo psicomotor:</label>
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
                      optionsArray={['Lenguaje expresivo', 'Lenguaje comprensivo', 'Lenguaje no verbal']}
                      divclass='mb-4'
                      value={medicalFormData.desarrolloComunicativo}
                      onChange={handleInputChange}
                    />
                    <label className='text-ln font-medium block mb-3'>Antecedentes conductuales:</label>
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
                    <label className='text-ln font-medium block mb-3'>Examen físico:</label>
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
                  <h3 className='text-xb font-medium'>II - Pruebas de detección estandarizadas:</h3>
                  <TextArea
                    name='pruebasEstandarizadas'
                    divclass='mb-2'
                    value={medicalFormData.pruebasEstandarizadas}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 mt-3 flex flex-col'>
                  <h3 className='text-xb font-medium'>III - Evaluación Sensorio - Motora:</h3>
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
                    <h3 className='text-xb font-medium'>IV - Evaluación Neurocognitiva:</h3>
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
                    <h3 className='text-xb font-medium'>V - Evaluación Neurolingüística:</h3>
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
                  <h3 className='text-xb font-medium'>VII - Sugerencias terapéuticas:</h3>
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
            ) : (
              <></>
            )}
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)} type={type} errors={errors}>
          <h1></h1>
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

createMedical.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
