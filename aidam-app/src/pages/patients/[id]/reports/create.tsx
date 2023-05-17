import { getOnePatient } from '@/services/patients';
import { useQuery } from '@tanstack/react-query';
import { NextPageContext } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { getLoggedUser } from '@/services/users';
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { centerHeaders, checkPageBreak } from '@/utils/jsPDF';

const create = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [planWidth, setPlanWidth] = useState(false);
  const [firstDateWidth, setFirstDateWidth] = useState(false);
  const [secondDateWidth, setSecondDateWidth] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [cookieError, setCookieError] = useState(false);
  const [therapeuticObjetives, setTherapeuticObjetives] = useState<
    Array<string>
  >([]);
  const [objective, setObjective] = useState<string>('');
  const [therapeuticStrategies, setTherapeuticStrategies] = useState<
    Array<string>
  >([]);
  const [strategy, setStrategy] = useState<string>('');
  const [reportDate, setReportDate] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [generalAspects, setGeneralAspects] = useState('');
  const [generalObjectives, setGeneralObjectives] = useState('');
  const [generalFODA, setGeneralFODA] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [secondPeriod, setSecondPeriod] = useState('');

  const signatureRef = useRef<SignatureCanvas>(null);

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

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let birthDate;
    if (patient.data?.birth) {
      birthDate = new Date(patient.data?.birth).toLocaleString().split(',')[0];
    }

    let signatureData;
    if (signatureRef.current) {
      signatureData = signatureRef.current.toDataURL();
    }

    let y = 10;

    const doc = new jsPDF();
    doc.setFont('Helvetica');
    doc.setFontSize(10);
    const lineHeight = 10;
    const spacing = 6;
    const headingFontSize = 14;

    centerHeaders('PLAN TERAPÉUTICO INTEGRAL', doc, headingFontSize, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`FECHA: ${reportDate}`, 10, y);
    y += 10;
    doc.text(`PERÍODO: ${reportPeriod} a Diciembre ${currentYear}`, 10, y);
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
    y += 20;
    centerHeaders('INFORME DE EVUALUACIÓN TERAPÉUTICA', doc, headingFontSize, y);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    y += 10;
    doc.text(
      'Se realiza la evaluación inicial del área, obteniendo los siguientes resultados:',
      10,
      y
    );
    y += 10;
    const maxWidth = 180;

    const generalAspectsText =
      'En relación al accionar del paciente y el encuadre, se puede puntualizar que: ' +
      generalAspects;

    const splitText = doc.splitTextToSize(generalAspectsText, maxWidth);
    splitText.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      y = checkPageBreak(doc, y);
    });

    const generalObjectivesText =
      'En razón a los aspectos específicos del área, según lo evaluado, se observa lo siguiente: ' +
      generalObjectives;

    const splitSecondText = doc.splitTextToSize(
      generalObjectivesText,
      maxWidth
    );
    splitSecondText.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      y = checkPageBreak(doc, y);
    });

    const generalFODAText = 'Se puede señalar  que el paciente: ' + generalFODA;

    const splitThirdText = doc.splitTextToSize(generalFODAText, maxWidth);
    splitThirdText.forEach((line: string) => {
      doc.text(line, 10, y);
      y += lineHeight;
      y = checkPageBreak(doc, y);
    });

    y += 10;

    centerHeaders(selectedPlanType, doc, headingFontSize, y);

    y += 10;

    doc.setFontSize(10);

    doc.text(`PERÍODO: ${secondPeriod} a Diciembre 2023`, 10, y);

    y += 10;

    doc.setFontSize(14);

    doc.text('OBJETIVOS TERAPÉUTICOS', 10, y);

    y += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);

    doc.text(
      'En función de lo evaluado, se proponen los siguientes objetivos específicos de abordaje: ',
      10,
      y
    );

    y += 10;
    y = checkPageBreak(doc, y);

    therapeuticObjetives.forEach((objective) => {
      doc.setFont('Helvetica');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`\u2022 ${objective}`, 10, y, { align: 'justify' });
      y = checkPageBreak(doc, y);
      y += spacing;
    });

    y += 10;

    doc.setFontSize(14);
    y = checkPageBreak(doc, y);

    doc.setFont('Helvetica', 'bold');

    doc.text('ESTRATEGIAS DE INTERVENCIÓN', 10, y);

    y += 10;
    y = checkPageBreak(doc, y);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);

    doc.text(
      'Los objetivos planteados se desarrollaran a partir de las siguientes estrategias de intervención: ',
      10,
      y
    );
    y = checkPageBreak(doc, y);

    y += 10;

    therapeuticStrategies.forEach((strat) => {
      doc.setFont('Helvetica');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`\u2022 ${strat}`, 10, y, { align: 'justify' });
      y = checkPageBreak(doc, y);
      y += spacing;
    });

    y += 10;
    y = checkPageBreak(doc, y);
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
    doc.text(`${user?.firstName} ${user?.lastName}`, 125, y + 10);

    y = checkPageBreak(doc, y);

    doc.save('report.pdf');
  };

  const patient = useQuery({
    queryKey: ['patient', query.id],
    keepPreviousData: true,
    queryFn: () => getOnePatient(query.id),
    retry: 1,
    onError: (error) => {
      setType(2);
      setErrors((error as any).response.data.errors);
      setOpen(true);
      setCookieError(true);
    },
  });

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

  return (
    <div className='px-14 py-10'>
      <div className='flex w-full justify-between mt-11 mb-5'>
        <h1>
          {patient.data?.firstName} {patient.data?.lastName}
        </h1>
        <h1 className='font-medium'>GENERAR INFORME</h1>
      </div>
      <hr className='mb-7' />
      <h1 className='flex justify-center font-medium'>
        PLAN TERAPÉUTICO INTEGRAL
      </h1>
      <form className='flex flex-col mt-7 gap-2'>
        <h1 className='mb-2 font-medium'>INFORME DE EVALUACIÓN TERAPÉUTICA:</h1>
        <div>
          <label className='font-medium' htmlFor='fecha'>
            Fecha:{' '}
          </label>
          <input
            value={reportDate}
            type='date'
            className='border focus:border-none focus:outline-none'
            id='fecha'
            onChange={(e) => setReportDate(e.target.value)}
          />
        </div>

        <div className='flex'>
          <label className='font-medium' htmlFor='period'>
            Período:{' '}
          </label>
          <select
            id='period'
            name='period'
            className={`bg-white bg-opacity-20 focus:border focus:outline-none border rounded-md mx-1 ${
              firstDateWidth ? 'w-32' : 'w-fit'
            }`}
            onChange={(e) => {
              setReportPeriod(e.target.value);
              setFirstDateWidth(true);
            }}
          >
            <option value='' disabled selected hidden>
              Seleccione mes de ingreso
            </option>
            {months.map((month) => (
              <option value={month}>{month}</option>
            ))}
          </select>

          <p>{'a Diciembre ' + currentYear}</p>
        </div>
        <p className='font-medium'>
          Se realiza la evaluación inicial del área, obteniendo los siguientes
          resultados
        </p>
        <div className='flex flex-col'>
          <label className='font-regular' htmlFor='accionar'>
            En relación al accionar del paciente y el encuadre, se puede
            puntualizar que:{' '}
          </label>
          <textarea
            id='accionar'
            name='accionar'
            className='rounded-xl outline-none p-3 shadow-card'
            placeholder='Detallar aspectos generales observados al comienzo de año, encuadre y ajuste al espacio terapéutico, aspectos conductuales, entre otros.'
            onChange={(e) => setGeneralAspects(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-regular' htmlFor='observacion'>
            En razón a los aspectos específicos del área, según lo evaluado, se
            observa lo siguiente:{' '}
          </label>
          <textarea
            id='observacion'
            name='observacion'
            className='rounded-xl outline-none p-3 shadow-card'
            placeholder='Completar con los aspectos consignados en el Protocolo de Evaluación pertinentes a cada especialidad y los resultados obtenidos.'
            onChange={(e) => setGeneralObjectives(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-regular' htmlFor='foda'>
            Se puede señalar que el paciente:{' '}
          </label>
          <textarea
            id='foda'
            name='foda'
            className='rounded-xl outline-none p-3 shadow-card h-fit'
            placeholder='Consignar observaciones significativas, fortalezas detectadas, entre otras.'
            onChange={(e) => setGeneralFODA(e.target.value)}
          />
        </div>
        <div className='flex mt-2'>
          <select
            id='period'
            name='period'
            className={`bg-white bg-opacity-20 p-1 focus:border focus:outline-none border rounded-md mr-1 ${
              !planWidth ? 'w-56' : 'w-fit'
            }`}
            onChange={(e) => {
              setPlanWidth(true);
              setSelectedPlanType(e.target.value);
            }}
          >
            <option value='' disabled selected hidden>
              Seleccione el tipo de plan
            </option>
            {planType.map((plan) => (
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
            id='secondPeriod'
            name='secondPeriod'
            className={`bg-white bg-opacity-20 focus:border focus:outline-none border rounded-md mx-1 ${
              secondDateWidth ? 'w-32' : 'w-fit'
            }`}
            onChange={(e) => {
              setSecondDateWidth(true);
              setSecondPeriod(e.target.value);
            }}
          >
            <option value='' disabled selected hidden>
              Mes de inicio de terapias
            </option>
            {months.map((month) => (
              <option value={month}>{month}</option>
            ))}
          </select>

          <p>{'a Diciembre ' + currentYear}</p>
        </div>
        <div className='flex flex-col gap-3 mb-6'>
          <h1 className='font-medium'>OBJETIVOS TERAPÉUTICOS</h1>
          <p>
            En función de lo evaluado, se proponen los siguientes objetivos
            específicos de abordaje:
          </p>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3'>
              <input
                value={objective}
                type='text'
                placeholder='Ingrese de a un objetivo aquí'
                className='px-1 focus:border focus:outline-none border rounded-md w-1/2'
                onChange={(e) => setObjective(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setObj(objective)}
                className='flex items-center text-sm font-normal text-white h-7.5 px-2.5 rounded-md bg-aidam80 hover:bg-aidam70 w-fit'
              >
                Agregar objetivo
              </button>
            </div>
            {therapeuticObjetives
              ? therapeuticObjetives.map((obj) => <li>{obj}</li>)
              : ''}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h1 className='font-medium'>ESTRATEGIAS DE INTERVENCIÓN</h1>
          <p>
            Los objetivos planteados se desarrollaran a partir de las siguientes
            estrategias de intervención:
          </p>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-3'>
              <input
                value={strategy}
                type='text'
                placeholder='Ingrese de a una estrategia aquí'
                className='px-1 focus:border focus:outline-none border rounded-md w-1/2'
                onChange={(e) => setStrategy(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setStrat(strategy)}
                className='flex items-center text-sm font-normal text-white h-7.5 px-2.5 rounded-md bg-aidam80 hover:bg-aidam70 w-fit'
              >
                Agregar estrategia
              </button>
            </div>
            {therapeuticStrategies
              ? therapeuticStrategies.map((strat) => <li>{strat}</li>)
              : ''}
          </div>
        </div>
        <div className='flex flex-col mt-20'>
          <p>Firma:</p>
          <div className='border w-fit border-rose-400'>
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 400,
                height: 200,
                className: 'signature-canvas',
              }}
            />
          </div>
        </div>
        <button
          type='submit'
          className='flex w-fit items-center text-sm font-normal text-white h-7.5 px-2.5 rounded-md bg-aidam80 hover:bg-aidam70'
          onClick={handleFormSubmit}
        >
          Generar informe
        </button>
      </form>
    </div>
  );
};

export default create;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

create.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
