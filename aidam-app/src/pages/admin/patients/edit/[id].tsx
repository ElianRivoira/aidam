import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { hasCookie } from 'cookies-next';

// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import Input from '@/components/form/Input';
import ArrowBack from '@/components/ArrowBack';
import { getOnePatient, putPatient } from '@/services/patients';
import Modal from '@/components/Modal';
import TagInputProf from '@/components/form/TagInputProfessionals';
import Button from '@/components/Button';

const editPatient = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [professionals, setProfessionals] = useState<INames[]>([]);
  const [patientInfo, setPatientInfo] = useState<FormPatient>({
    firstName: '',
    lastName: '',
    dni: '',
    birth: '',
    socialwork: '',
    affiliateNumber: '',
    authorizedModule: '',
    diagnosis: '',
    email: '',
    phone: '',
    cud: '',
    adress: '',
    school: '',
    shift: '',
    schoolYear: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    files && setCertificate(files[0]);
  };

  const patient = useQuery({
    queryKey: ['patient', query.id],
    enabled: hasCookie('session'),
    queryFn: () => getOnePatient(query.id),
  });

  const editPatient = useMutation({
    mutationFn: putPatient,
    onSuccess: editedPatient => {
      setType(1);
      setOpen(true);
    },
    onError: (err: any) => {
      setType(2);
      setErrors(err.response.data.errors);
      setOpen(true);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(patientInfo).forEach(key => {
      formData.append(key, patientInfo[key]);
    });
    formData.append('professionals', JSON.stringify(professionals));
    certificate && formData.append('certificate', certificate as Blob);

    if (patient.data) {
      formData.append('_id', patient.data?._id);
      editPatient.mutate({ id: patient.data._id, form: formData });
    }
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      router.push(`/patients/${query.id}/profile`);
    }
  }, [open]);

  useEffect(() => {
    if (patient.isSuccess) {
      setPatientInfo({
        firstName: patient.data.firstName,
        lastName: patient.data.lastName,
        dni: patient.data.dni.toString(),
        birth: patient.data.birth.toString().split('T')[0],
        socialwork: patient.data.socialwork,
        affiliateNumber: patient.data.affiliateNumber,
        authorizedModule: patient.data.authorizedModule,
        diagnosis: patient.data.diagnosis,
        email: patient.data.email,
        phone: patient.data.phone.toString(),
        cud: patient.data.cud,
        adress: patient.data.adress,
        school: patient.data.school,
        shift: patient.data.shift,
        schoolYear: patient.data.schoolYear,
      });
      setProfessionals(
        patient.data.professionalsId.map(prof => {
          return {
            firstName1: prof.firstName.split(' ')[0],
            firstName2: prof.firstName.split(' ')[1],
            lastName1: prof.lastName.split(' ')[0],
            lastName2: prof.lastName.split(' ')[1],
            id: prof._id,
          };
        })
      );
    }
  }, [patient.isSuccess]);

  return (
    <>
      <Head>
        <title>AIDAM Admin - Editar paciente</title>
      </Head>
      <main className='pt-6 lg:pt-12 bg-background'>
        {/* <NavbarDesktop /> */}
        <div className='w-full px-6 lg:px-12 mb-4'>
          <ArrowBack route={`/patients/${query.id}/profile`} />
          <h1 className='text-center text-xl4 font-semibold lgMax:mt-3'>EDITAR PACIENTE</h1>
          <form encType='multipart/form-data' onSubmit={handleSubmit} className='mt-20 flex flex-col'>
            <div className='flex lgMax:flex-col justify-evenly'>
              <div className='flex flex-col w-full lg:w-1/4 gap-5 lgMax:mb-5 items-center'>
                <Input
                  label='Nombre'
                  name='firstName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.firstName}
                  placeholder='Ejemplo'
                />
                <Input
                  label='Apellido'
                  name='lastName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.lastName}
                  placeholder='Ejemplo'
                />
                <Input
                  label='DNI'
                  name='dni'
                  type='tel'
                  onChange={e => handleChange(e)}
                  value={patientInfo.dni}
                  placeholder='12345678'
                />
                <Input
                  label='Fecha de Nacimiento'
                  name='birth'
                  type='date'
                  onChange={e => handleChange(e)}
                  value={patientInfo.birth}
                />
                <Input
                  label='Dirección'
                  name='adress'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.adress}
                  placeholder='Ejemplo 1234'
                />
                <Input
                  label='Escuela'
                  name='school'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.school}
                  placeholder='Ejemplo'
                />
              </div>
              <div className='flex flex-col w-full lg:w-1/4 gap-5 lgMax:mb-5 items-center'>
                <Input
                  label='Turno'
                  name='shift'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.shift}
                  placeholder='Ejemplo'
                />
                <Input
                  label='Año académico'
                  name='schoolYear'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.schoolYear}
                  placeholder=''
                />
                <Input
                  label='Obra Social'
                  name='socialwork'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.socialwork}
                  placeholder='EJEMPLO'
                />
                <Input
                  label='N° de Afiliado'
                  name='affiliateNumber'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.affiliateNumber}
                  placeholder='03/18688242/06'
                />
                <Input
                  label='Módulo Autorizado'
                  name='authorizedModule'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.authorizedModule}
                  placeholder='18688242'
                />
                <Input
                  label='CUD'
                  name='cud'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.cud}
                  // placeholder='18688242'
                />
                <Input
                  label='Diagnóstico'
                  name='diagnosis'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.diagnosis}
                  placeholder='Trastorno ...'
                />
              </div>
              <div className='flex flex-col w-full lg:w-1/4 gap-5 lgMax:mb-5 items-center'>
                <Input
                  label='Correo Electrónico'
                  name='email'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.email}
                  placeholder='ejemplo@ejemplo.com'
                />
                <Input
                  label='N° de Teléfono'
                  name='phone'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.phone}
                  placeholder='+5491234567890'
                />
                <Input
                  label='Subir certificado'
                  name='certificate'
                  type='file'
                  value={certificate?.name}
                  onChange={e => handleFile(e)}
                />
                <TagInputProf tagged={professionals} setTagged={setProfessionals} patient={patient.data} />
              </div>
            </div>
            <div className='flex justify-between lg:justify-evenly mt-10'>
              <div className='w-1/4'></div>
              <div className='w-1/4'></div>
              <div className='w-1/4 flex justify-end'>
                <Button type='submit' text='Confirmar' classname='px-10 py-2' />
              </div>
            </div>
          </form>
          <Modal open={open} onClose={() => setOpen(false)} type={type} errors={errors}>
            <h1>Paciente editado satisfactoriamente</h1>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default editPatient;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

editPatient.getInitialProps = async ({ query }: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
