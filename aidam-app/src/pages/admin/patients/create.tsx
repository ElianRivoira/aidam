import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import Input from '@/components/form/Input';
import ArrowBack from '@/components/ArrowBack';
import TagInput from '@/components/form/TagInput';
import { postPatient } from '@/services/patients';
import Modal from '@/components/Modal';

const create = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [professionals, setProfessionals] = useState<string[]>([]);
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    files && setCertificate(files[0]);
    console.log(files)
  };

  const postObs = useMutation({
    mutationFn: postPatient,
    onSuccess: newPatient => {
      setType(1);
      setOpen(true);
      console.log(newPatient);
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

    formData.forEach((value, key) => {
      console.log(key, value);
    });
    postObs.mutate(formData);
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      router.push('/patients');
    }
  }, [open]);

  return (
    <>
      <Head>
        <title>AIDAM Admin - Nuevo paciente</title>
      </Head>
      <main className='min-h-screen bg-background'>
        <NavbarDesktop />
        <div className='w-full mt-12 px-12'>
          <ArrowBack />
          <h1 className='text-center text-xl4 font-semibold'>NUEVO PACIENTE</h1>
          <form
            encType='multipart/form-data'
            onSubmit={handleSubmit}
            className='mt-20 flex flex-col'
          >
            <div className='flex justify-evenly'>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Nombre'
                  name='firstName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.firstName}
                />
                <Input
                  label='Nombre'
                  name='lastName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.lastName}
                />
                <Input
                  label='DNI'
                  name='dni'
                  type='tel'
                  onChange={e => handleChange(e)}
                  value={patientInfo.dni}
                />
                <Input
                  label='Fecha de Nacimiento'
                  name='birth'
                  type='date'
                  onChange={e => handleChange(e)}
                  value={patientInfo.birth}
                />
              </div>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Obra Social'
                  name='socialwork'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.socialWork}
                />
                <Input
                  label='N° de Afiliado'
                  name='affiliateNumber'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.affiliateNumber}
                />
                <Input
                  label='Módulo Autorizado'
                  name='authorizedModule'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.authorizedModule}
                />
                <Input
                  label='Diagnóstico'
                  name='diagnosis'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.diagnosis}
                />
              </div>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Correo Electrónico'
                  name='email'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.email}
                />
                <Input
                  label='N° de Teléfono'
                  name='phone'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={patientInfo.phone}
                />
                <TagInput
                  taggedProfs={professionals}
                  setTaggedProfs={setProfessionals}
                />
                <Input
                  label='Subir certificado'
                  name='certificate'
                  type='file'
                  value={certificate?.name}
                  onChange={e => handleFile(e)}
                />
              </div>
            </div>
            <div className='flex justify-evenly mt-10'>
              <div className='w-1/4'></div>
              <div className='w-1/4'></div>
              <div className='w-1/4 flex justify-end'>
                <button
                  type='submit'
                  className='border px-10 py-2 rounded-md bg-aidam80 hover:bg-aidam70 transition-colors text-white w-fit self-end'
                >
                  Confirmar
                </button>
              </div>
            </div>
          </form>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            type={type}
            errors={errors}
          >
            <h1>Paciente creado satisfactoriamente</h1>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default create;
