import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

// import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import Input from '@/components/form/Input';
import ArrowBack from '@/components/ArrowBack';
import TagInputProf from '@/components/form/TagInputProfessionals';
import { postPatient } from '@/services/patients';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
// import { getLoggedUser } from '@/services/users';

const create = () => {
  const router = useRouter();
  // const [cookieError, setCookieError] = useState(false);
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

  // const loggedUser = useQuery({
  //   queryKey: ['loggedUser'],
  //   queryFn: getLoggedUser,
  //   retry: 1,
  //   onError: error => {
  //     setType(2);
  //     setErrors((error as any).response.data.errors);
  //     setOpen(true);
  //     setCookieError(true);
  //   },
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    files && setCertificate(files[0]);
  };

  const postObs = useMutation({
    mutationFn: postPatient,
    onSuccess: newPatient => {
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
    // loggedUser.data && formData.append('userId', loggedUser.data?._id);
    certificate && formData.append('certificate', certificate as Blob);

    postObs.mutate(formData);
  };

  useEffect(() => {
    // if (type === 2 && !open && cookieError) router.push('/login');
    if (type === 1 && open === false) {
      router.push('/patients');
    }
  }, [open]);

  return (
    <>
      <Head>
        <title>AIDAM Admin - Nuevo paciente</title>
      </Head>
      <main className='min-h-screen pt-6 lg:pt-12 bg-background'>
        {/* <NavbarDesktop /> */}
        <div className='w-full px-6 lg:px-12 mb-4'>
          <ArrowBack route='/patients' />
          <h1 className='text-center text-xl4 font-semibold lgMax:mt-3'>NUEVO PACIENTE</h1>
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
                  value={patientInfo.socialWork}
                  placeholder='Ejemplo'
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
                  // placeholder='Trastorno ...'
                />
              </div>
              <div className='flex flex-col w-full lg:w-1/4 gap-5 lg:gap-9 items-center'>
                <Input
                  label='Diagnóstico'
                  name='diagnosis'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.diagnosis}
                  placeholder='Trastorno ...'
                />
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
                <TagInputProf tagged={professionals} setTagged={setProfessionals} />
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
            <h1>Paciente creado satisfactoriamente</h1>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default create;
