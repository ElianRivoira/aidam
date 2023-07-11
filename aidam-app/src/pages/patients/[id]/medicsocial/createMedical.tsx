import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useMutation, useQuery } from '@tanstack/react-query';
import SignatureCanvas from 'react-signature-canvas';

// import Navbar from '@/components/navbar/Navbar';
// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getOnePatient, uploadMedicalReport } from '@/services/patients';
import { TextArea, DateInput, RadioInput, TextInput } from '@/components/reports/Inputs';
import { getLoggedUser } from '@/services/users';
import Modal from '@/components/Modal';
import ArrowBack from '@/components/ArrowBack';
import { FisiatricCheck } from '@/components/reports/fisiatricCheck';
import { setCanvasHeight, setCanvasWidth } from '@/utils/canvas';
import { generateHCFPDF, generateHCPDF } from '@/utils/generatePDF/medicalReports';
import Button from '@/components/Button';

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

  //HC

  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const firmaRef = useRef<SignatureCanvas>(null);

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

  const handleCheckboxChange = (event: any, setter: Dispatch<SetStateAction<setterType>>) => {
    const { name, checked } = event.target;
    setter(prevValues => ({
      ...prevValues,
      [name]: checked,
    }));
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
    onError: error => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

  const uploadMed = useMutation({
    mutationFn: uploadMedicalReport,
    onSuccess: editedPatient => {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
    }
  }, []);

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
      setHitosDeDesarrollo(prevState => {
        const updatedHitos = [...prevState];
        updatedHitos[index].value = 0;
        return updatedHitos;
      });
    } else {
      setHitosDeDesarrollo(prevState => {
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
          onChange={event => handleUpdateValue(index, parseInt(event.target.value))}
          className='w-6 px-0.5 outline-none border rounded-md border-slate-300 hover:border-aidam80 transition-colors'
        />
      </div>
    ));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    generateHCFPDF(e, patient, loggedUser, firmaRef, uploadMed, {
      reportDate,
      embarazoValues,
      embarazoOptional,
      partoValues,
      recienNacido,
      recienNacidoOptional,
      hitosDeDesarrollo,
      complementario,
      cirugia,
      conducta,
      conductaOptional,
      lenguaje,
      lenguajeOptional,
      vision,
      visionOptional,
      audicion,
      audicionOptional,
      comprension,
      esfinteres,
      alimentacion,
      alimentacionOptional,
      sueño,
      sueñoOptional,
      primaria,
      secundaria,
      adaptacion,
      lectoEscritura,
      obsLectoescritura,
      diagEtiologico,
      diagFuncional,
      gmfcs,
      marcha,
      equipamiento,
      fim,
      barthel,
      otraEscala,
      medActual,
      inter,
      objectives,
      observations,
    });
  };

  return (
    <>
      <Head>
        <title>{`AIDAM - Generar informe médico`}</title>
      </Head>
      <main className='flex flex-col items-center pt-3 lg:pt-7 bg-background'>
        {/* {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />} */}
        <div className='w-full lg:px-12'>
          <div className='flex flex-col lgMax:px-4'>
            <div className='flex justify-between items-center mb-3 lg:mb-7 w-full'>
              <div className='flex lgMax:self-start items-center lg:gap-8 gap-4'>
                <ArrowBack route={`/patients/${query.id}/medicsocial`} width={useMediaQuery(1024) ? 33 : undefined} />
                <h2 className='text-xg lgMax:text-lm font-medium'>
                  {patient.data?.firstName} {patient.data?.lastName}
                </h2>
              </div>
              <h1 className='text-xl2 lgMax:text-xg font-medium'>GENERAR INFORME</h1>
            </div>
            <hr className='border-black03 w-full' />
            <h1 className='text-xl2.5 lgMax:text-xl2 font-medium mt-7 mb-8 text-center'>INFORME MÉDICO</h1>
            <div className='flex flex-col self-center mb-5'>
              <label htmlFor='selectForm' className='text-ln lgMax:text-lb'>
                Seleccione el tipo de informe
              </label>
              <select
                name='selectForm'
                id='selectForm'
                value={formType}
                onChange={e => setFormType(e.target.value)}
                className='outline-none lgMax:text-lb border border-black02 hover:border-aidam80 transition-colors rounded-md p-1 mt-1'
              >
                <option value='' hidden></option>
                <option value='hcFisiatrica'>Historia clínica fisiátrica</option>
                <option value='hc'>Historia clínica</option>
              </select>
            </div>
            {formType === 'hc' ? (
              <form onSubmit={e => generateHCPDF(e, medicalFormData, patient, loggedUser, firmaRef, uploadMed)}>
                <h3 className='text-xb lgMax:text-ln font-medium'>I - Evaluación de Crecimiento y Desarrollo</h3>
                <div className='flex lgMax:flex-col mt-6'>
                  <div className='w-1/3 lgMax:w-full px-4'>
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
                    <label className='text-ln lgMax:text-lb font-medium block mb-3'>
                      Antecedentes de embarazo y perinatales:
                    </label>
                    <TextArea
                      label='OEA:'
                      name='oea'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.oea}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Tamiz metabólico:'
                      name='tamizMetabólico'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.tamizMetabólico}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Factores pronósticos negativos:'
                      name='factoresNegativos'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.factoresNegativos}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Evaluaciones y terapias conductuales o educativas complementarias y/o alternativas:'
                      name='evaluacionesComplementarias'
                      divclass='mb-2'
                      placeholder='Ingrese las evaluaciones y terapias complementarias'
                      value={medicalFormData.evaluacionesComplementarias}
                      onChange={handleTextAreaChange}
                    />
                  </div>
                  <div className='w-1/3 lgMax:w-full px-4'>
                    <label className='text-ln lgMax:text-lb font-medium block mb-3'>Desarrollo psicomotor:</label>
                    <TextArea
                      label='Alimentación:'
                      name='alimentacion'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.alimentacion}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Sueño:'
                      name='sueño'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.sueño}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Motricidad gruesa:'
                      name='motricidadGruesa'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.motricidadGruesa}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Motricidad fina:'
                      name='motricidadFina'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.motricidadFina}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Control de esfínteres:'
                      name='controlEsfinteres'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={1}
                      value={medicalFormData.controlEsfinteres}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Temperamento:'
                      name='temperamento'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
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
                  <div className='w-1/3 lgMax:w-full px-4'>
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
                    <label className='text-ln lgMax:text-lb font-medium block mb-3'>Antecedentes conductuales:</label>
                    <TextArea
                      label='Situación estresante en último año:'
                      name='situacionEstresante'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={2}
                      value={medicalFormData.situacionEstresante}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Factores de riesgo identificados:'
                      name='factoresRiesgo'
                      divclass='mb-2'
                      labelclass='font-normal text-lm lgMax:text-ss'
                      minRows={2}
                      value={medicalFormData.factoresRiesgo}
                      onChange={handleTextAreaChange}
                    />
                    <label className='text-ln lgMax:text-lb font-medium block mb-3'>Examen físico:</label>
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
                <div className='w-2/3 lgMax:w-full mt-3 px-4'>
                  <h3 className='text-xb lgMax:text-ln font-medium'>II - Pruebas de detección estandarizadas:</h3>
                  <TextArea
                    name='pruebasEstandarizadas'
                    divclass='mb-2'
                    value={medicalFormData.pruebasEstandarizadas}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 lgMax:w-full mt-3 flex flex-col px-4'>
                  <h3 className='text-xb lgMax:text-ln font-medium'>III - Evaluación Sensorio - Motora:</h3>
                  <TextArea
                    label='a) Audición:'
                    name='audicion'
                    divclass='mb-2'
                    value={medicalFormData.audicion}
                    onChange={handleTextAreaChange}
                  />
                  <DateInput
                    name='dateA'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateA}
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
                    name='dateB'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateB}
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
                    name='dateC'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateC}
                    onChange={handleInputChange}
                  />
                  <TextArea
                    label='d) Evaluación motora:'
                    name='evaluacionMotora'
                    divclass='mb-2'
                    value={medicalFormData.evaluacionMotora}
                    onChange={handleTextAreaChange}
                  />
                  <DateInput
                    name='dateD'
                    label='Fecha:'
                    divclass='self-end'
                    value={medicalFormData.dateD}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='w-2/3 lgMax:w-full mt-3 flex flex-col px-4'>
                  <div className='flex lgMax:flex-col lg:justify-between lg:items-center'>
                    <h3 className='text-xb lgMax:text-ln font-medium'>IV - Evaluación Neurocognitiva:</h3>
                    <DateInput
                      name='dateE'
                      label='Fecha:'
                      divclass='lg:self-end'
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
                <div className='w-2/3 lgMax:w-full mt-3 flex flex-col px-4'>
                  <div className='flex lgMax:flex-col lg:justify-between lg:items-center'>
                    <h3 className='text-xb lgMax:text-ln font-medium'>V - Evaluación Neurolingüística:</h3>
                    <DateInput
                      name='dateF'
                      label='Fecha:'
                      divclass='lg:self-end'
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
                <div className='w-2/3 lgMax:w-full mt-3 flex flex-col px-4'>
                  <h3 className='text-xb lgMax:text-ln font-medium'>VI - Diagnóstico:</h3>
                  <TextArea
                    name='diagnostico'
                    divclass='mb-2'
                    value={medicalFormData.diagnostico}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='w-2/3 lgMax:w-full mt-3 flex flex-col px-4'>
                  <h3 className='text-xb lgMax:text-ln font-medium'>VII - Sugerencias terapéuticas:</h3>
                  <TextArea
                    name='sugerenciasTerapeuticas'
                    divclass='mb-2'
                    value={medicalFormData.sugerenciasTerapeuticas}
                    onChange={handleTextAreaChange}
                  />
                </div>
                <div className='flex flex-col mt-20 px-4'>
                  <p>Firma:</p>
                  <div className='border rounded-md w-fit border-aidam80'>
                    <SignatureCanvas
                      ref={firmaRef}
                      canvasProps={{
                        width: setCanvasWidth('firmaRef', screenWidth),
                        height: setCanvasHeight('firmaRef', screenWidth),
                      }}
                      minWidth={1}
                      maxWidth={1}
                      dotSize={1}
                      velocityFilterWeight={1}
                    />
                  </div>
                </div>
                <div className='flex justify-end my-4'>
                  <Button type='submit' text='Generar Informe' />
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
                    className='border rounded-md hover:border-aidam80 focus:border-none focus:outline-none'
                    id='fecha'
                    onChange={e => setReportDate(e.target.value)}
                  />
                </div>
                <h3 className='text-xb font-medium'>ANTECEDENTES MATERNOS:</h3>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setEmbarazoValues)}
                  booleanObject={embarazoValues}
                  array={['A término', 'Prematuro', 'Controlado']}
                  valueSetter={setEmbarazoOptional}
                  title='Embarazo'
                  inputText='Patologías'
                  placeholder='Indique aquí si tuvo alguna/s patología/s'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setPartoValues)}
                  booleanObject={partoValues}
                  array={['Espontaneo', 'Inducido', 'Cesarea', 'Fórceps']}
                  title='Parto'
                />
                <h3 className='text-xb font-medium'>CARACTERÍSTICAS RECIÉN NACIDO:</h3>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setRecienNacido)}
                  booleanObject={recienNacido}
                  array={['Prematuro', 'A Término', 'Gemelar', 'Fórceps', 'Incubadora', 'Ictericia', 'Convulsiones']}
                  valueSetter={setRecienNacidoOptional}
                  placeholder='Indique aquí si tuvo alguna otra característica/s'
                  inputText='Otros'
                />
                <h3 className='text-xb font-medium'>CARACTERÍSTICAS DEL DESARROLLO:</h3>
                <h4 className='text-xs italic'>{`(Coloque la cantidad de meses)`}</h4>
                <div className='flex gap-4 w-2/3'>
                  <div className='flex gap-3 flex-wrap'>{renderHitos()}</div>
                </div>
                <h3 className='text-xb font-medium'>ESTUDIOS COMPLEMENTARIOS:</h3>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setComplementario)}
                  booleanObject={complementario}
                  array={['RMN', 'RX', 'TAC', 'PEV', 'OEA', 'PEA']}
                />
                <div className='lg:w-2/3'>
                  <TextArea
                    label='CIRUGÍAS:'
                    name='cirugia'
                    minRows={2}
                    value={cirugia}
                    onChange={e => setCirugia(e.target.value)}
                  />
                </div>
                <h3 className='text-xb font-medium'>ESTADO ACTUAL:</h3>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setConducta)}
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
                  title='Conducta'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setLenguaje)}
                  booleanObject={lenguaje}
                  array={['Adecuado a la edad', 'Infantil', 'Dislalias', 'Disartria', 'Pobre', 'No habla']}
                  valueSetter={setLenguajeOptional}
                  placeholder='Indique aquí si existe otro tipo de lenguaje'
                  inputText='Otros'
                  title='Lenguaje'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setVision)}
                  booleanObject={vision}
                  array={['Normal', 'Usa lentes', 'Ceguera', 'Retinopatía', 'Estrabismo', 'Cataratas']}
                  valueSetter={setVisionOptional}
                  placeholder='Indique aquí si existe otro tipo de visión'
                  inputText='Otros'
                  title='Visión'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setAudicion)}
                  booleanObject={audicion}
                  array={['Normal', 'Hipoacusia', 'Audífonos']}
                  valueSetter={setAudicionOptional}
                  placeholder='Indique aquí si existe otro tipo de audición'
                  inputText='Otros'
                  title='Audición'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setComprension)}
                  booleanObject={comprension}
                  array={[
                    'Adecuada a la edad:',
                    'Limitada',
                    'Responde a consignas elementales',
                    'No responde a consignas elementales',
                  ]}
                  title='Comprensión'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setEsfinteres)}
                  booleanObject={esfinteres}
                  array={['Vesical total', 'Parcial', 'No controla', 'Anal total', 'Parcial', 'No controla']}
                  title='Control de esfínteres'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setAlimentacion)}
                  booleanObject={alimentacion}
                  array={['Conservada', 'Sonda nasogástrica', 'Gastrostomía']}
                  valueSetter={setAlimentacionOptional}
                  placeholder='Indique aquí si existe otro tipo de alimentación'
                  inputText='Otros'
                  title='Alimentación'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setSueño)}
                  booleanObject={sueño}
                  array={['Conservado', 'Insomnio']}
                  valueSetter={setSueñoOptional}
                  placeholder='Indique aquí si existe otro tipo de patrones'
                  inputText='Otros'
                  title='Patrones de sueño'
                />
                <h5 className='font-bold text-ln'>Escolaridad</h5>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setPrimaria)}
                  booleanObject={primaria}
                  array={['Común', 'Integrada', 'Domiciliaria']}
                  title='Primaria'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setSecundaria)}
                  booleanObject={secundaria}
                  array={['Común', 'Integrada', 'Domiciliaria']}
                  title='Secundaria'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setAdaptacion)}
                  booleanObject={adaptacion}
                  array={['Buena', 'Regular', 'Mala']}
                  title='Adaptación'
                />
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setLectoEscritura)}
                  booleanObject={lectoEscritura}
                  array={['Si', 'No']}
                  title='Lectoescritura'
                />
                <div className='lg:w-2/3 flex flex-col gap-3'>
                  {lectoEscritura.checkbox1 === true && (
                    <TextArea
                      minRows={2}
                      label='Observaciones'
                      name='obsLectoEscritura'
                      placeholder='Ingrese observaciones'
                      value={obsLectoescritura}
                      onChange={e => setObsLectoescritura(e.target.value)}
                    />
                  )}
                  <TextArea
                    minRows={2}
                    label='DIAGNÓSTICO ETIOLÓGICO:'
                    name='diagEtiologico'
                    placeholder='Ingrese diagnóstico'
                    value={diagEtiologico}
                    onChange={e => setDiagEtiologico(e.target.value)}
                  />
                  <TextArea
                    minRows={2}
                    label='DIAGNÓSTICO FUNCIONAL'
                    name='diagFuncional'
                    placeholder='Ingrese diagnóstico'
                    value={diagFuncional}
                    onChange={e => setDiagFuncional(e.target.value)}
                  />
                  <h3 className='text-xb font-medium'>ASPECTO MOTOR:</h3>
                  <TextInput
                    label='GMFCS:'
                    name='gmfcs'
                    placeholder='Ingrese GMFCS'
                    value={gmfcs}
                    onChange={e => setGmfcs(e.target.value)}
                  />
                </div>
                <h3 className='text-xb font-medium'>MARCHA:</h3>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setMarcha)}
                  booleanObject={marcha}
                  array={['Independiente', 'Dependiente']}
                />
                <h3 className='text-xb font-medium'>EQUIPAMIENTO:</h3>
                <FisiatricCheck
                  onChangeCheck={e => handleCheckboxChange(e, setEquipamiento)}
                  booleanObject={equipamiento}
                  array={['Ortesis', 'Bastones', 'Andador', 'Silla de ruedas']}
                />
                <h3 className='text-xb font-medium'>HABITOS DE LA VIDA DIARIA (AVD):</h3>
                <div className='flex lgMax:flex-col gap-4 justify-between'>
                  <div className='lg:w-1/3'>
                    <TextInput
                      label='ESCALA FIM:'
                      name='fim'
                      placeholder='Ingrese escala FIM'
                      value={fim}
                      onChange={e => setFim(e.target.value)}
                    />
                  </div>
                  <div className='lg:w-1/3'>
                    <TextInput
                      label='ESCALA BARTHEL:'
                      name='barthel'
                      placeholder='Ingrese escala BARTHEL'
                      value={barthel}
                      onChange={e => setBarthel(e.target.value)}
                    />
                  </div>
                  <div className='lg:w-1/3'>
                    <TextInput
                      label='ESCALA OTROS:'
                      name='otraEscala'
                      placeholder='Ingrese otros'
                      value={otraEscala}
                      onChange={e => setOtraEscala(e.target.value)}
                    />
                  </div>
                </div>
                <div className='lg:w-2/3 flex flex-col gap-3'>
                  <TextArea
                    minRows={2}
                    label='MEDICACIÓN ACTUAL:'
                    name='actualMed'
                    placeholder='Ingrese medicación'
                    value={medActual}
                    onChange={e => setMedActual(e.target.value)}
                  />
                  <TextArea
                    minRows={2}
                    label='INTERCONSULTAS:'
                    name='inter'
                    placeholder='Ingrese interconsultas'
                    value={inter}
                    onChange={e => setInter(e.target.value)}
                  />
                  <h3 className='text-xb font-medium'>PLAN TERAPÉUTICO</h3>
                  <TextArea
                    minRows={2}
                    label='OBJETIVOS:'
                    name='objectives'
                    placeholder='Ingrese objetivos'
                    value={objectives}
                    onChange={e => setObjectives(e.target.value)}
                  />
                  <TextArea
                    minRows={2}
                    label='OBSERVACIONES:'
                    name='observations'
                    placeholder='Ingrese observaciones'
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                  />
                </div>
                <div className='flex flex-col mt-10'>
                  <p>Firma:</p>
                  <div className='border rounded-md w-fit border-aidam80'>
                    <SignatureCanvas
                      ref={firmaRef}
                      canvasProps={{
                        width: setCanvasWidth('firmaRef', screenWidth),
                        height: setCanvasHeight('firmaRef', screenWidth),
                      }}
                      minWidth={1}
                      maxWidth={1}
                      dotSize={1}
                      velocityFilterWeight={1}
                    />
                  </div>
                </div>
                <div className='flex justify-end my-4'>
                  <Button type='submit' text='Generar Informe' />
                </div>
              </form>
            ) : (
              ''
            )}
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)} type={type} errors={errors}>
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

createMedical.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
