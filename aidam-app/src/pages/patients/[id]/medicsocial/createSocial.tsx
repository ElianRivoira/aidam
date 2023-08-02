import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { useMutation, useQuery } from '@tanstack/react-query';
import SignatureCanvas from 'react-signature-canvas';

import useMediaQuery from '@/hooks/useMediaQuery';
import { getOnePatient, uploadSocialReport } from '@/services/patients';
import { TextArea, DateInput, RadioInput, TextInput, CheckboxInput } from '@/components/reports/Inputs';
import { getLoggedUser } from '@/services/users';
import Modal from '@/components/Modal';
import ArrowBack from '@/components/ArrowBack';
import generatePDF from '@/utils/generatePDF/socialReport';
import { croquis400x130, croquis562x179, croquis295x94 } from '@/assets/images/base64/croquis';
import { linkageNetMap296x293, linkageNetMap400x400, linkageNetMap600x595 } from '@/assets/images/base64/linkageNetMap';
import SetTableData from '@/components/reports/social/SetTableData';
import { employmentSituation, familiarGroup, socialNet, comunitaryCastMap } from '@/utils/socialReport/componentsData';
import SocialSecurity from '@/components/reports/social/SocialSecurity';
import { setCanvasHeight, setCanvasWidth } from '@/utils/canvas';
import Button from '@/components/Button';

const createSocial = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [cookieError, setCookieError] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const firmaRef = useRef<SignatureCanvas>(null);
  const linkageNetMapRef = useRef<SignatureCanvas>(null);
  const croquisRef = useRef<SignatureCanvas>(null);
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const [socialFormData, setSocialFormData] = useState<SocialFormData>({
    date1: '',
    socialWorkAccess: '',
    cud: '',
    nextExpiration: '',
    interviewed: '',
    phone: '',
    familyGroup: [],
    socialNetwork: [],
    familyGenogram: '',
    obsFamilyType: '',
    homeOwner: '',
    homePossession: '',
    homePossessionExtra: '',
    wallsMaterial: '',
    roofMaterial: '',
    floorMaterial: '',
    bathAmount: '',
    bathFlushing: '',
    bathFlushingExtra: '',
    bathAdapted: '',
    services: {
      Luz: '',
      Agua: '',
      Gas: '',
      Cloacas: '',
    },
    bedRoomsAmount: '',
    whereAndWhoSleep: '',
    enviroment: '',
    obsAmbient: '',
    socialSecurity: {
      AUH: {
        checked: false,
        whoCollectsIt: '',
        obs: '',
        amount: '',
      },
      AUHD: {
        checked: false,
        whoCollectsIt: '',
        obs: '',
        amount: '',
      },
      SUAF: {
        checked: false,
        whoCollectsIt: '',
        obs: '',
        amount: '',
      },
      PNC: {
        checked: false,
        whoCollectsIt: '',
        obs: '',
        amount: '',
      },
    },
    employmentSituation: [],
    obsSocioeconomic: '',
    comunitaryCast: [],
    obsLinkageNetMap: '',
    comunicWithInstit: '',
    attendsInterviews: '',
    obsFamilyParticipation: '',
    personalCaretaker: '',
    personalCaretakerName: '',
    personalCaretakerWhy: '',
    whoBathedHim: '',
    restTime: '',
    eatTime: '',
    medicsTime: '',
    haveAccessQualityFood: '',
    shareEatTimeWithFamily: '',
    howOrganizeBuyPrepareFood: '',
    comunication: '',
    interests: '',
    expectationsOfInstitution: '',
    previousTreatments: '',
    barriersOnInclusion: '',
    obsRoutine: '',
    professionalConclusion: '',
  });
  const [familyData, setFamilyData] = useState<IFamily>({
    id: 0,
    name: '',
    relationship: '',
    age: '',
    civilState: '',
    ocupation: '',
    health: '',
    observations: '',
  });
  const [socialNetData, setSocialNetData] = useState<IFamily>({
    id: 0,
    name: '',
    relationship: '',
    age: '',
    civilState: '',
    ocupation: '',
    health: '',
    observations: '',
  });
  const [livingGroup, setLivingGroup] = useState<ILivingGroup>({
    nameLink: '',
    incomeSource: '',
    employmentStability: '',
    daysOfWork: '',
    incomeAmount: '',
  });
  const [comunitaryCast, setComunitaryCast] = useState<IComunitaryCast>({
    institution: '',
    referent: '',
    contact: '',
    obs: '',
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

  const uploadSoc = useMutation({
    mutationFn: uploadSocialReport,
    onSuccess: editedPatient => {
      setSuccessMsg('Informe social cargado correctamente');
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
    setSocialFormData({ ...socialFormData, [name]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSocialFormData({ ...socialFormData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'services') {
      setSocialFormData({
        ...socialFormData,
        services: { ...socialFormData.services, [value]: socialFormData.services[value] === value ? '' : value },
      });
    } else if (name === 'socialSecurity') {
      setSocialFormData({
        ...socialFormData,
        socialSecurity: {
          ...socialFormData.socialSecurity,
          [value]: {
            ...socialFormData.socialSecurity[value],
            checked: !socialFormData.socialSecurity[value].checked,
          },
        },
      });
    }
  };

  const handleFamilyGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFamilyData({ ...familyData, [name]: value });
  };

  const handleSocialNet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialNetData({ ...socialNetData, [name]: value });
  };

  const handleLivingGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLivingGroup({ ...livingGroup, [name]: value });
  };

  const handleSocialSecurity = (e: React.ChangeEvent<HTMLInputElement>, assignation: string) => {
    const { name, value } = e.target;
    setSocialFormData({
      ...socialFormData,
      socialSecurity: {
        ...socialFormData.socialSecurity,
        [assignation]: {
          ...socialFormData.socialSecurity[assignation],
          [name]: value,
        },
      },
    });
  };

  const handleComunitaryCast = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComunitaryCast({
      ...comunitaryCast,
      [name]: value,
    });
  };

  const handleAddFamily = () => {
    setSocialFormData({
      ...socialFormData,
      familyGroup: [...socialFormData.familyGroup, { ...familyData, id: socialFormData.familyGroup.length + 1 }],
    });
    setFamilyData({
      id: 0,
      name: '',
      relationship: '',
      age: '',
      civilState: '',
      ocupation: '',
      health: '',
      observations: '',
    });
  };

  const handleDeleteFamily = (name: string) => {
    const filteredFamilyGroup = socialFormData.familyGroup.filter(familyData => familyData.name !== name);
    setSocialFormData({ ...socialFormData, familyGroup: [...filteredFamilyGroup] });
  };

  const handleAddSocialNet = () => {
    setSocialFormData({
      ...socialFormData,
      socialNetwork: [
        ...socialFormData.socialNetwork,
        { ...socialNetData, id: socialFormData.socialNetwork.length + 1 },
      ],
    });
    setSocialNetData({
      id: 0,
      name: '',
      relationship: '',
      age: '',
      civilState: '',
      ocupation: '',
      health: '',
      observations: '',
    });
  };

  const handleDeleteSocialNet = (name: string) => {
    const filteredSocialNetwork = socialFormData.socialNetwork.filter(socialNetData => socialNetData.name !== name);
    setSocialFormData({ ...socialFormData, socialNetwork: [...filteredSocialNetwork] });
  };

  const handleAddEmploymentSituation = () => {
    setSocialFormData({
      ...socialFormData,
      employmentSituation: [...socialFormData.employmentSituation, { ...livingGroup }],
    });
    setLivingGroup({
      nameLink: '',
      incomeSource: '',
      employmentStability: '',
      daysOfWork: '',
      incomeAmount: '',
    });
  };

  const handleDeleteEmploymentSituation = (name: string) => {
    const filteredLivingGroup = socialFormData.employmentSituation.filter(livingGroup => livingGroup.nameLink !== name);
    setSocialFormData({ ...socialFormData, employmentSituation: [...filteredLivingGroup] });
  };

  const handleAddComunitaryCast = () => {
    setSocialFormData({
      ...socialFormData,
      comunitaryCast: [...socialFormData.comunitaryCast, { ...comunitaryCast }],
    });
    setComunitaryCast({
      institution: '',
      referent: '',
      contact: '',
      obs: '',
    });
  };

  const handleDeleteComunitaryCast = (name: string) => {
    const filteredComunitaryCast = socialFormData.comunitaryCast.filter(cast => cast.institution !== name);
    setSocialFormData({ ...socialFormData, comunitaryCast: [...filteredComunitaryCast] });
  };

  useEffect(() => {
    if (linkageNetMapRef) {
      if (screenWidth && screenWidth > 700) {
        linkageNetMapRef.current?.fromDataURL(linkageNetMap600x595, { width: 600, height: 595 });
      } else if (screenWidth && screenWidth > 464) {
        linkageNetMapRef.current?.fromDataURL(linkageNetMap400x400, { width: 400, height: 400 });
      } else if (screenWidth) {
        linkageNetMapRef.current?.fromDataURL(linkageNetMap296x293, { width: 296, height: 293 });
      }
    }
    if (croquisRef) {
      if (screenWidth && screenWidth > 700) {
        croquisRef.current?.fromDataURL(croquis562x179, { width: 562, height: 179 });
      } else if (screenWidth && screenWidth > 464) {
        croquisRef.current?.fromDataURL(croquis400x130, { width: 400, height: 130 });
      } else if (screenWidth) {
        croquisRef.current?.fromDataURL(croquis295x94, { width: 295, height: 94 });
      }
    }
  }, [screenWidth]);

  return (
    <>
      <Head>
        <title>{`AIDAM - Generar informe social`}</title>
      </Head>
      <main className='flex flex-col items-center pt-3 lg:pt-7 bg-background'>
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
            <h1 className='text-xl2.5 font-medium mt-7 mb-8 text-center'>FICHA SOCIAL</h1>
            <form
              onSubmit={e =>
                generatePDF(e, socialFormData, patient, loggedUser, croquisRef, firmaRef, linkageNetMapRef, uploadSoc)
              }
            >
              <div className='flex lgMax:flex-col mt-6'>
                <div className='w-full px-4'>
                  <DateInput
                    label='Fecha de la entrevista:'
                    name='date1'
                    divclass='mb-8'
                    value={socialFormData.date1}
                    onChange={handleInputChange}
                  />
                  <div className='lg:w-2/3 w-full'>
                    <TextInput
                      required
                      label='¿Por quién accede a la cobertura de la obra social?:'
                      divclass='mb-2 lgMax:block flex items-center'
                      name='socialWorkAccess'
                      labelclass='text-ln lgMax:text-lb font-medium mr-1'
                      value={socialFormData.socialWorkAccess}
                      onChange={handleInputChange}
                    />
                    <div className='lg:flex lgMax:block gap-10 items-center mb-2 lg:h-[26px]'>
                      <RadioInput
                        label='CUD'
                        divclass='flex gap-5'
                        labelclass='mb-0'
                        internalDivClass='flex gap-3 items-center'
                        name='cud'
                        optionsArray={['SI.cud', 'NO.cud']}
                        value={socialFormData.cud}
                        onChange={handleInputChange}
                      />
                      {socialFormData.cud === 'SI.cud' && (
                        <TextInput
                          required
                          label='Próximo vencimiento:'
                          divclass='lgMax:block flex items-center'
                          name='nextExpiration'
                          labelclass='text-ln lgMax:text-lb font-medium mr-1'
                          value={socialFormData.nextExpiration}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                    <div className='lg:flex justify-between gap-3'>
                      <TextInput
                        required
                        label='Entrevistado/a:'
                        divclass='mb-2'
                        name='interviewed'
                        labelclass='text-ln lgMax:text-lb font-medium'
                        value={socialFormData.interviewed}
                        onChange={handleInputChange}
                      />
                      <TextInput
                        required
                        label='Teléfono:'
                        divclass='mb-2'
                        name='phone'
                        labelclass='text-ln lgMax:text-lb font-medium'
                        value={socialFormData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className='border w-fit my-3 border-aidam80'>
                    <SignatureCanvas
                      ref={croquisRef}
                      canvasProps={{
                        width: setCanvasWidth('croquisRef', screenWidth),
                        height: setCanvasHeight('croquisRef', screenWidth),
                      }}
                      minWidth={1}
                      maxWidth={1}
                      dotSize={1}
                      velocityFilterWeight={1}
                    />
                  </div>
                  <SetTableData
                    title='Grupo Familiar Conviviente:'
                    breakpoint={useMediaQuery(1024)}
                    collectedData={familyData}
                    inputs={familiarGroup}
                    dataToMap={socialFormData.familyGroup}
                    handleChange={handleFamilyGroup}
                    handleDelete={handleDeleteFamily}
                    handleAdd={handleAddFamily}
                  />
                  <SetTableData
                    title='Red Social y Significativa para el grupo familiar:'
                    breakpoint={useMediaQuery(1024)}
                    collectedData={socialNetData}
                    inputs={socialNet}
                    dataToMap={socialFormData.socialNetwork}
                    handleChange={handleSocialNet}
                    handleAdd={handleAddSocialNet}
                    handleDelete={handleDeleteSocialNet}
                  />
                  <div className='lg:w-2/3 w-full'>
                    <TextArea
                      label='Genograma Familiar Vincular:'
                      name='familyGenogram'
                      divclass='mb-4'
                      labelclass='underline'
                      placeholder=''
                      value={socialFormData.familyGenogram}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Observaciones:'
                      name='obsFamilyType'
                      divclass='mb-5'
                      labelclass=''
                      placeholder='(Tipo de familia - Características de los vínculos entre los miembros - Temporalidad de
                        los mismos - Roles - Funciones - Otros)'
                      value={socialFormData.obsFamilyType}
                      onChange={handleTextAreaChange}
                    />
                    <h3 className='font-medium text-ln my-2'>VIVIENDA</h3>
                    <div className='lg:w-2/3 w-full'>
                      <TextInput
                        required
                        label='Titular de la vivienda o lote:'
                        name='homeOwner'
                        divclass='mb-3'
                        value={socialFormData.homeOwner}
                        onChange={handleInputChange}
                      />
                    </div>
                    <RadioInput
                      optionsArray={[
                        'Propietario',
                        'Préstamos',
                        'Ocupante de hecho',
                        'Inquilino',
                        'Cesión',
                        'Convive con el propietario',
                        'Otro.homePossession',
                      ]}
                      label='Tenencia'
                      divclass=''
                      name='homePossession'
                      value={socialFormData.homePossession}
                      onChange={handleInputChange}
                    />
                    {socialFormData.homePossession === 'Otro.homePossession' && (
                      <TextInput
                        label='Otro:'
                        name='homePossessionExtra'
                        divclass='mb-3 mt-1'
                        value={socialFormData.homePossessionExtra}
                        onChange={handleInputChange}
                      />
                    )}
                    <div className='lg:w-2/3 w-full'>
                      <h4 className='text-ln lgMax:text-lb font-medium my-2'>Materiales</h4>
                      <TextInput
                        required
                        label='Paredes:'
                        name='wallsMaterial'
                        divclass='mb-3 mt-1'
                        value={socialFormData.wallsMaterial}
                        onChange={handleInputChange}
                      />
                      <TextInput
                        required
                        label='Techos:'
                        name='roofMaterial'
                        divclass='mb-3 mt-1'
                        value={socialFormData.roofMaterial}
                        onChange={handleInputChange}
                      />
                      <TextInput
                        required
                        label='Pisos:'
                        name='floorMaterial'
                        divclass='mb-3 mt-1'
                        value={socialFormData.floorMaterial}
                        onChange={handleInputChange}
                      />
                    </div>
                    <h4 className='text-ln lgMax:text-lb font-medium my-2'>Baño</h4>
                    <div className='flex lgMax:flex-col gap-4'>
                      <div className='lg:w-[25%] w-1/2'>
                        <TextInput
                          required
                          label='Cantidad:'
                          name='bathAmount'
                          divclass=''
                          value={socialFormData.bathAmount}
                          onChange={handleInputChange}
                        />
                      </div>
                      <RadioInput
                        optionsArray={['Con descarga a red pública', 'Pozo', 'Otro.bathFlushing']}
                        divclass=''
                        name='bathFlushing'
                        value={socialFormData.bathFlushing}
                        onChange={handleInputChange}
                      />
                    </div>
                    {socialFormData.bathFlushing === 'Otro.bathFlushing' && (
                      <TextInput
                        label='Otro:'
                        name='bathFlushingExtra'
                        divclass='mb-3 mt-2'
                        value={socialFormData.bathFlushingExtra}
                        onChange={handleInputChange}
                      />
                    )}
                    <RadioInput
                      label='Adaptado a las necesidades del concurrente:'
                      optionsArray={['SI.bathAdapted', 'NO.bathAdapted']}
                      internalDivClass='flex gap-2'
                      labelclass='text-lb'
                      divclass='lg:mt-2 lgMax:my-2'
                      name='bathAdapted'
                      value={socialFormData.bathAdapted}
                      onChange={handleInputChange}
                    />
                    <CheckboxInput
                      label='Servicios:'
                      optionsArray={['Luz', 'Agua', 'Gas', 'Cloacas']}
                      divclass={useMediaQuery(1024) ? '' : 'mt-3'}
                      internalDivClass={useMediaQuery(1024) ? '' : 'flex gap-4'}
                      labelclass='mr-0'
                      name='services'
                      value={socialFormData.services}
                      onChange={handleCheckboxChange}
                    />
                    <div className='flex lgMax:flex-col w-full my-3 gap-3'>
                      <TextInput
                        required
                        label='N° de dormitorios:'
                        labelclass=''
                        name='bedRoomsAmount'
                        divclass='w-[30%] lgMax:w-full'
                        value={socialFormData.bedRoomsAmount}
                        onChange={handleInputChange}
                      />
                      <TextInput
                        required
                        label='¿Con quién y dónde duerme?'
                        labelclass='mr-1'
                        name='whereAndWhoSleep'
                        divclass='w-[70%] lgMax:w-full lgMax:block flex items-center'
                        value={socialFormData.whereAndWhoSleep}
                        onChange={handleInputChange}
                      />
                    </div>
                    <TextArea
                      label='Entorno:'
                      name='enviroment'
                      divclass='my-3'
                      labelclass=''
                      value={socialFormData.enviroment}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Observaciones:'
                      name='obsAmbient'
                      divclass='mb-5'
                      labelclass=''
                      placeholder='(Indicadores de déficit habitacional - Estado de conservación del ambiente, otro)'
                      value={socialFormData.obsAmbient}
                      onChange={handleTextAreaChange}
                    />
                    <h3 className='font-medium text-ln underline my-2'>Situación económica - laboral de la familia:</h3>
                  </div>
                  <SocialSecurity
                    breakpoint={useMediaQuery(1024)}
                    socialFormData={socialFormData}
                    handleCheckboxChange={handleCheckboxChange}
                    handleSocialSecurity={handleSocialSecurity}
                  />
                  <SetTableData
                    title='Situación laboral - Otros ingresos del grupo conviviente:'
                    breakpoint={useMediaQuery(1024)}
                    collectedData={livingGroup}
                    inputs={employmentSituation}
                    dataToMap={socialFormData.employmentSituation}
                    handleAdd={handleAddEmploymentSituation}
                    handleDelete={handleDeleteEmploymentSituation}
                    handleChange={handleLivingGroup}
                  />
                  <div className='lg:w-2/3 w-full'>
                    <TextArea
                      label='Observaciones:'
                      name='obsSocioeconomic'
                      divclass='mb-5'
                      labelclass=''
                      placeholder='(Evaluación socio - económica en función de egresos familiares y posibilidades de ascenso social-Indicar si la familia ha recibido algún tipo de ayuda social directa por Municipio, Gobierno y/o Nación)'
                      value={socialFormData.obsSocioeconomic}
                      onChange={handleTextAreaChange}
                    />
                  </div>
                  <SetTableData
                    title='Elenco Comunitario:'
                    subtitle='Actividades recreativas o culturales, escolaridad, tratamientos ambulatorios, etc.'
                    breakpoint={useMediaQuery(1024)}
                    collectedData={comunitaryCast}
                    dataToMap={socialFormData.comunitaryCast}
                    inputs={comunitaryCastMap}
                    handleAdd={handleAddComunitaryCast}
                    handleDelete={handleDeleteComunitaryCast}
                    handleChange={handleComunitaryCast}
                  />
                  <h3 className='font-medium text-ln underline mt-2'>Mapa de redes vinculares:</h3>
                  <p className='mb-2'>
                    Se ubican las relaciones más cercanas del concurrente, en distintos niveles y áreas, donde mientras
                    más cercano al centro, más estrecho es el vínculo.
                  </p>
                  <div className='border w-fit my-3 border-aidam80'>
                    <SignatureCanvas
                      ref={linkageNetMapRef}
                      canvasProps={{
                        width: setCanvasWidth('linkageNetMapRef', screenWidth),
                        height: setCanvasHeight('linkageNetMapRef', screenWidth),
                      }}
                      minWidth={1}
                      maxWidth={1}
                      dotSize={1}
                      velocityFilterWeight={1}
                    />
                  </div>
                  <div className='lg:w-2/3'>
                    <TextArea
                      label='Observaciones:'
                      name='obsLinkageNetMap'
                      divclass='mb-5'
                      labelclass=''
                      value={socialFormData.obsLinkageNetMap}
                      onChange={handleTextAreaChange}
                    />
                    <h3 className='font-medium text-ln underline my-2'>Participación familiar</h3>
                    <TextInput
                      required
                      label='Comunicación con la Institución:'
                      divclass='mb-2'
                      name='comunicWithInstit'
                      labelclass='mr-0'
                      value={socialFormData.comunicWithInstit}
                      onChange={handleInputChange}
                    />
                    <TextInput
                      required
                      label='Asiste a las entrevistas:'
                      divclass='mb-2'
                      name='attendsInterviews'
                      labelclass='mr-0'
                      value={socialFormData.attendsInterviews}
                      onChange={handleInputChange}
                    />
                    <TextArea
                      label='Observaciones:'
                      name='obsFamilyParticipation'
                      divclass='mb-5'
                      labelclass=''
                      value={socialFormData.obsFamilyParticipation}
                      onChange={handleTextAreaChange}
                    />
                    <h3 className='font-medium text-ln underline my-2'>Rutina del/la concurrente</h3>
                    <div className='flex lgMax:flex-col gap-4 lg:items-center mb-2'>
                      <RadioInput
                        optionsArray={['SI.personalCaretaker', 'NO.personalCaretaker']}
                        label='Tiene cuidador ocasional:'
                        divclass='flex gap-2 flex-wrap lg:w-[40%]'
                        internalDivClass='flex items-center gap-2'
                        name='personalCaretaker'
                        labelclass='mr-0 text-lb lgMax:text-lm'
                        value={socialFormData.personalCaretaker}
                        onChange={handleInputChange}
                      />
                      {socialFormData.personalCaretaker === 'SI.personalCaretaker' && (
                        <TextInput
                          required
                          label='¿Quién?'
                          divclass='lg:w-[60%]'
                          name='personalCaretakerName'
                          labelclass='mr-0'
                          value={socialFormData.personalCaretakerName}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                    <TextArea
                      minRows={2}
                      label='¿Por qué?'
                      divclass='mb-2'
                      name='personalCaretakerWhy'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.personalCaretakerWhy}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='¿Quién lo baña?¿Cómo y con qué frecuencia?'
                      divclass='mb-2'
                      name='whoBathedHim'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.whoBathedHim}
                      onChange={handleTextAreaChange}
                    />
                    <TextInput
                      required
                      label='Horario de descanso:'
                      divclass='mb-2'
                      name='restTime'
                      labelclass=''
                      value={socialFormData.restTime}
                      onChange={handleInputChange}
                    />
                    <TextInput
                      required
                      label='Horario de comida:'
                      divclass='mb-2'
                      name='eatTime'
                      labelclass=''
                      value={socialFormData.eatTime}
                      onChange={handleInputChange}
                    />
                    <TextInput
                      required
                      label='Horario de medicamento:'
                      divclass='mb-2'
                      name='medicsTime'
                      labelclass=''
                      value={socialFormData.medicsTime}
                      onChange={handleInputChange}
                    />
                    <TextArea
                      minRows={2}
                      label='¿Tiene acceso a alimentos de calidad?'
                      divclass='mb-2'
                      name='haveAccessQualityFood'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.haveAccessQualityFood}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='¿El concurrente comparte el momento de la comida con la familia?'
                      divclass='mb-2'
                      name='shareEatTimeWithFamily'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.shareEatTimeWithFamily}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='¿Cómo se organiza la familia al momento de comprar, elaborar y consumir la comida?'
                      divclass='mb-3'
                      name='howOrganizeBuyPrepareFood'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.howOrganizeBuyPrepareFood}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='Comunicación (tipo/barreras):'
                      divclass='mb-3'
                      name='comunication'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.comunication}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='Intereses/gustos del concurrente:'
                      divclass='mb-2'
                      name='interests'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.interests}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='Expectativas - Qué se espera de la Institución:'
                      divclass='mb-2'
                      name='expectationsOfInstitution'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.expectationsOfInstitution}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='Tratamientos anteriores:'
                      divclass='mb-2'
                      name='previousTreatments'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.previousTreatments}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      minRows={2}
                      label='Barreras en relación a la inclusión:'
                      divclass='mb-2'
                      name='barriersOnInclusion'
                      labelclass='font-normal text-lb lgMax:text-lm'
                      value={socialFormData.barriersOnInclusion}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Observaciones:'
                      divclass='mb-5'
                      name='obsRoutine'
                      labelclass=''
                      value={socialFormData.obsRoutine}
                      onChange={handleTextAreaChange}
                    />
                    <TextArea
                      label='Conclusión profesional:'
                      divclass='mb-5'
                      name='professionalConclusion'
                      labelclass=''
                      placeholder='(Evaluación de indicadores que hacen a la calidad de vida - Red vincular interna - Problemáticas identificadas - Coberturas sociales - Indicadores de negligencia familiar - Necesidad de trabajo interdisciplinario - Redes Interinstitucionales - Otros datos necesarios para el seguimiento de la situación familiar u orientación familiar-Indicadores de vulnerabilidad social)'
                      value={socialFormData.professionalConclusion}
                      onChange={handleTextAreaChange}
                    />
                    <div className='flex flex-col mt-20'>
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
                  </div>
                </div>
              </div>
              <div className='flex justify-end my-4'>
                <Button type='submit' text='Generar Informe' />
              </div>
            </form>
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)} type={type} errors={errors}>
          <h1>{successMsg}</h1>
        </Modal>
      </main>
    </>
  );
};

export default createSocial;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

createSocial.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
