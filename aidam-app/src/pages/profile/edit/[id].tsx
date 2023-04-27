import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { hasCookie } from 'cookies-next';

import NavbarDesktop from '@/components/navbar/NavbarDesktop';
import Input from '@/components/form/Input';
import ArrowBack from '@/components/ArrowBack';
import Modal from '@/components/Modal';
import { findUserById, getLoggedUser, putUser } from '@/services/users';
import TagInputPatients from '@/components/form/TagInputPatients';
import professions from '@/utils/professions';

const editUser = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [patients, setPatients] = useState<INames[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [userInfo, setUserInfo] = useState<FormUser>({
    firstName: '',
    lastName: '',
    license: '',
    profession: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    files && setProfileImage(files[0]);
  };

  const user = useQuery({
    queryKey: ['user'],
    enabled: hasCookie('session'),
    queryFn: () => findUserById(query.id),
  });

  const editUser = useMutation({
    mutationFn: putUser,
    onSuccess: editedUser => {
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

    Object.keys(userInfo).forEach(key => {
      formData.append(key, userInfo[key]);
    });
    profileImage && formData.append('profileImage', profileImage as Blob);

    if (user.data) {
      formData.append('_id', user.data?._id);
      editUser.mutate(formData);
    }
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      router.push(`/profile/${user.data?._id}`);
    }
  }, [open]);

  useEffect(() => {
    if (user.isSuccess && user.data.phone) {
      setUserInfo({
        firstName: user.data.firstName,
        lastName: user.data.lastName,
        license: user.data.license,
        profession: user.data.profession,
        email: user.data.email,
        phone: user.data.phone.toString(),
      });
      setPatients(
        user.data.patientsId.map(patient => {
        return {
          firstName1: patient.firstName.split(' ')[0],
          firstName2: patient.firstName.split(' ')[1],
          lastName1: patient.lastName.split(' ')[0],
          lastName2: patient.lastName.split(' ')[1],
        };
      }))
    }
  }, [user.isSuccess]);

  return (
    <>
      <Head>
        <title>AIDAM {user.data?.admin ? 'Admin' : ''} - Editar usuario</title>
      </Head>
      <main className='min-h-screen bg-background'>
        <NavbarDesktop />
        <div className='w-full mt-12 px-12'>
          <ArrowBack />
          <h1 className='text-center text-xl4 font-semibold'>
            EDITAR USUARIO
          </h1>
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
                  value={userInfo.firstName}
                  placeholder='Ejemplo'
                />
                <Input
                  label='Apellido'
                  name='lastName'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={userInfo.lastName}
                  placeholder='Ejemplo'
                />
                <Input
                  label='Correo Electrónico'
                  name='email'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={userInfo.email}
                  placeholder='ejemplo@ejemplo.com'
                />
              </div>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Profesión'
                  name='profession'
                  type='select'
                  onChangeSelect={handleChange}
                  value={userInfo.profession}
                  valuesArray={professions}
                />
                <Input
                  label='N° de Matrícula'
                  name='license'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={userInfo.license}
                  placeholder='03/18688242/06'
                />
                <Input
                  label='N° de Teléfono'
                  name='phone'
                  type='text'
                  onChange={e => handleChange(e)}
                  value={userInfo.phone}
                  placeholder='+5491234567890'
                />
              </div>
              <div className='flex flex-col w-1/4 gap-9 items-center'>
                <Input
                  label='Subir foto de perfil'
                  name='profileImage'
                  type='file'
                  value={profileImage?.name}
                  onChange={e => handleFile(e)}
                />
                {user.data?.admin && (
                  <TagInputPatients
                    tagged={patients}
                    setTagged={setPatients}
                    user={user.data}
                  />
                )}
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
            <h1>Paciente editado satisfactoriamente</h1>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default editUser;

interface MyPageProps {
  query: {
    [key: string]: string;
  };
}

editUser.getInitialProps = async ({
  query,
}: NextPageContext): Promise<MyPageProps> => {
  const castedQuery = query as unknown as MyPageProps['query'];
  return { query: castedQuery };
};
