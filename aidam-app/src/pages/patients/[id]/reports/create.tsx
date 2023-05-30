import React, { useEffect, useRef, useState } from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { hasCookie } from 'cookies-next';
import { useMutation, useQuery } from '@tanstack/react-query';
import SignatureCanvas from 'react-signature-canvas';

import { getOnePatient, uploadReport } from '@/services/patients';
import { getLoggedUser } from '@/services/users';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import useMediaQuery from '@/hooks/useMediaQuery';
import Navbar from '@/components/navbar/Navbar';
import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import ArrowBack from '@/components/ArrowBack';
import { DateInput, TextArea } from '@/components/reports/Inputs';
import { setCanvasHeight, setCanvasWidth } from '@/utils/canvas';
import { generateTRPDF } from '@/utils/generatePDF/therapistReport';

const create = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [planWidth, setPlanWidth] = useState(false);
  const [firstDateWidth, setFirstDateWidth] = useState(false);
  const [secondDateWidth, setSecondDateWidth] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [cookieError, setCookieError] = useState(false);
  const [therapeuticObjetives, setTherapeuticObjetives] = useState<Array<string>>([]);
  const [objective, setObjective] = useState('');
  const [therapeuticStrategies, setTherapeuticStrategies] = useState<Array<string>>([]);
  const [strategy, setStrategy] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [generalAspects, setGeneralAspects] = useState('');
  const [generalObjectives, setGeneralObjectives] = useState('');
  const [generalFODA, setGeneralFODA] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [secondPeriod, setSecondPeriod] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);

  const firmaRef = useRef<SignatureCanvas>(null);

  const [months, setMonths] = useState([
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
  ]);
  const [planType, setPlanType] = useState([
    'PLAN DE ABORDAJE INDIVIDUAL 2023 ',
    'PLAN DE ABORDAJE INDIVIDUAL SEMESTRAL',
    'INFORME DE EVOLUCIÓN FINAL (PARA PADRES)',
  ]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
    }
  }, []);

  const upload = useMutation({
    mutationFn: uploadReport,
    onSuccess: editedPatient => {
      setSuccessMsg('Informe cargado correctamente');
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const patient = useQuery({
    queryKey: ['patient', query.id],
    keepPreviousData: true,
    queryFn: () => getOnePatient(query.id),
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
    if (type === 1 && !open) router.push(`/patients/${query.id}/reports`);
  }, [open]);

  const { data: user } = useQuery({
    queryKey: ['loggedUser'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  const setObj = (obj: string) => {
    if (obj) {
      setTherapeuticObjetives([...therapeuticObjetives, obj]);
      setObjective('');
    }
  };

  const setStrat = (strat: string) => {
    if (strat) {
      setTherapeuticStrategies([...therapeuticStrategies, strat]);
      setStrategy('');
    }
  };

  useEffect(() => {
    if (!hasCookie('session')) {
      router.push('/login');
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    generateTRPDF(e, patient, user, firmaRef, upload, {
      therapeuticObjetives,
      objective,
      therapeuticStrategies,
      strategy,
      reportDate,
      reportPeriod,
      generalAspects,
      generalObjectives,
      generalFODA,
      selectedPlanType,
      secondPeriod,
      currentDate,
      currentYear,
    });
  };

  return (
    <>
      <Head>
        <title>{`AIDAM - Generar informe`}</title>
      </Head>
      <main className='flex flex-col items-center min-h-screen bg-background'>
        {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />}
        <div className='w-full md:px-14 px-4 pb-10 text-lh md:text-base'>
          <div className='flex justify-between items-center my-3 lg:my-7 w-full'>
            <div className='flex lgMax:self-start items-center lg:gap-8 gap-4'>
              <ArrowBack width={40} route={`/patients/${patient.data?._id}/reports`} />
              <h2 className='text-xg lgMax:text-lm font-medium'>
                {patient.data?.firstName} {patient.data?.lastName}
              </h2>
            </div>
            <h1 className='text-xl2 lgMax:text-xg font-medium'>GENERAR INFORME</h1>
          </div>
          <hr className='mb-7 border-black03 w-full' />
          <h1 className='text-xl2.5 font-medium mt-7 mb-8 text-center'>PLAN TERAPÉUTICO INTEGRAL</h1>
          <form className='flex flex-col mt-7 gap-2' onSubmit={handleFormSubmit}>
            <h1 className='mb-2 font-medium'>INFORME DE EVALUACIÓN TERAPÉUTICA:</h1>
            <div>
              <DateInput
                label='Fecha:'
                name='reportDate'
                divclass='mb-8'
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
              />
            </div>
            <div className='flex'>
              <label className='font-medium' htmlFor='period'>
                Período:{' '}
              </label>
              <select
                id='period'
                name='period'
                className={`bg-white bg-opacity-20 focus:border focus:outline-none border border-slate-300 hover:border-aidam80 rounded-md mx-1 ${
                  firstDateWidth ? 'w-32' : 'w-fit'
                }`}
                required
                onChange={e => {
                  setReportPeriod(e.target.value);
                  setFirstDateWidth(true);
                }}
              >
                <option value='' hidden>
                  Seleccione mes de ingreso
                </option>
                {months.map(month => (
                  <option value={month}>{month}</option>
                ))}
              </select>

              <p>{'a Diciembre ' + currentYear}</p>
            </div>
            <p className='font-medium text-ln'>
              Se realiza la evaluación inicial del área, obteniendo los siguientes resultados
            </p>
            <div className='flex flex-col lg:w-2/3 w-full'>
              <TextArea
                label='En relación al accionar del paciente y el encuadre, se puede puntualizar que:'
                name='accionar'
                divclass='mb-4'
                labelclass='font-normal text-lb'
                placeholder='Detallar aspectos generales observados al comienzo de año, encuadre y ajuste al espacio terapéutico, aspectos conductuales, entre otros.'
                value={generalAspects}
                onChange={e => setGeneralAspects(e.target.value)}
              />
              <TextArea
                label='En razón a los aspectos específicos del área, según lo evaluado, se observa lo siguiente:'
                name='observacion'
                divclass='mb-4'
                labelclass='font-normal text-lb'
                placeholder='Completar con los aspectos consignados en el Protocolo de Evaluación pertinentes a cada especialidad y los resultados obtenidos.'
                value={generalObjectives}
                onChange={e => setGeneralObjectives(e.target.value)}
              />
              <TextArea
                label='Se puede señalar que el paciente:'
                name='foda'
                divclass='mb-4'
                labelclass='font-normal text-lb'
                placeholder='Consignar observaciones significativas, fortalezas detectadas, entre otras.'
                value={generalFODA}
                onChange={e => setGeneralFODA(e.target.value)}
              />
            </div>
            <div className='flex mt-2'>
              <select
                required
                id='period'
                name='period'
                value={selectedPlanType}
                className={`bg-white bg-opacity-20 p-0.5 focus:border focus:outline-none border border-slate-300 hover:border-aidam80 rounded-md mr-1 ${
                  !planWidth ? 'w-56' : 'w-fit'
                }`}
                onChange={e => {
                  setPlanWidth(true);
                  setSelectedPlanType(e.target.value);
                }}
              >
                <option value='' hidden>
                  Seleccione el tipo de plan
                </option>
                {planType.map(plan => (
                  <>
                    <option value={plan}>{plan}</option>
                  </>
                ))}
              </select>
            </div>
            <div className='flex mb-11'>
              <label className='font-medium' htmlFor='secondPeriod'>
                Período:
              </label>
              <select
                required
                id='secondPeriod'
                name='secondPeriod'
                className={`bg-white bg-opacity-20 focus:border focus:outline-none border rounded-md mx-1 ${
                  secondDateWidth ? 'w-32' : 'w-fit'
                }`}
                onChange={e => {
                  setSecondDateWidth(true);
                  setSecondPeriod(e.target.value);
                }}
              >
                <option value='' hidden>
                  Mes de inicio de terapias
                </option>
                {months.map(month => (
                  <option value={month}>{month}</option>
                ))}
              </select>

              <p>{'a Diciembre ' + currentYear}</p>
            </div>
            <div className='flex flex-col gap-3 mb-6'>
              <h1 className='font-medium'>OBJETIVOS TERAPÉUTICOS</h1>
              <p>En función de lo evaluado, se proponen los siguientes objetivos específicos de abordaje:</p>
              <div className='flex flex-col gap-2'>
                <div className='flex gap-3'>
                  <input
                    value={objective}
                    type='text'
                    placeholder='Ingrese de a un objetivo aquí'
                    className='px-1 focus:border focus:outline-none border border-slate-300 hover:border-aidam80 rounded-md w-1/2'
                    onChange={e => setObjective(e.target.value)}
                  />
                  <Button type='button' onClick={() => setObj(objective)} text='Agregar objetivo' />
                </div>
                {therapeuticObjetives ? therapeuticObjetives.map(obj => <li>{obj}</li>) : ''}
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <h1 className='font-medium'>ESTRATEGIAS DE INTERVENCIÓN</h1>
              <p>Los objetivos planteados se desarrollaran a partir de las siguientes estrategias de intervención:</p>
              <div className='flex flex-col gap-2'>
                <div className='flex gap-3'>
                  <input
                    value={strategy}
                    type='text'
                    placeholder='Ingrese de a una estrategia aquí'
                    className='px-1 focus:border focus:outline-none border border-slate-300 hover:border-aidam80 rounded-md w-1/2'
                    onChange={e => setStrategy(e.target.value)}
                  />
                  <Button type='button' onClick={() => setStrat(strategy)} text='Agregar estrategia' />
                </div>
                {therapeuticStrategies ? therapeuticStrategies.map(strat => <li>{strat}</li>) : ''}
              </div>
            </div>
            <div className='flex flex-col mt-20'>
              <p>Firma:</p>
              <div className='border w-fit rounded-md border-aidam80'>
                <SignatureCanvas
                  ref={firmaRef}
                  canvasProps={{
                    width: setCanvasWidth('firmaRef', screenWidth),
                    height: setCanvasHeight('firmaRef', screenWidth),
                  }}
                />
              </div>
            </div>
          <Button type='submit' text='Generar informe' classname='mt-4' />
          </form>
          <Modal open={open} onClose={() => setOpen(false)} type={type} errors={errors}>
            <h1>{successMsg}</h1>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default create;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

create.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
