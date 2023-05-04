import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Image from 'next/image';
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
import useMediaQuery from '@/hooks/useMediaQuery';
import Navbar from '@/components/navbar/Navbar';
import profileIcon from '@/assets/icons/profileImage.svg';

const editUser = ({ query }: MyPageProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [patients, setPatients] = useState<INames[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [pathImg, setPathImg] = useState('');
  const [userInfo, setUserInfo] = useState<FormUser>({
    firstName: '',
    lastName: '',
    license: '',
    profession: '',
    email: '',
    phone: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function load() {
          if (typeof reader.result === 'string') setPathImg(reader.result);
        };

        setProfileImage(file);
      }
    } else {
      setPathImg('');
      setProfileImage(null);
    }
  };

  const loggedUser = useQuery({
    queryKey: ['loggedUser'],
    enabled: hasCookie('session'),
    queryFn: getLoggedUser,
  });

  const user = useQuery({
    queryKey: ['user', query.id],
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
    formData.append('patients', JSON.stringify(patients));
    profileImage && formData.append('profileImage', profileImage as Blob);

    if (user.data) {
      formData.append('_id', user.data?._id);
      editUser.mutate(formData);
    }
  };

  useEffect(() => {
    if (type === 1 && open === false) {
      router.push(`/profile/${user.data?._id}`);
      user.refetch();
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
        })
      );
    }
  }, [user.isSuccess]);

  return (
    <>
      <Head>
        <title>
          AIDAM {loggedUser.data?.admin ? 'Admin' : ''} - Editar usuario
        </title>
      </Head>
      <main className='min-h-screen bg-background'>
        {useMediaQuery(1024) ? <Navbar /> : <NavbarDesktop />}
        <div className='w-full mt-12 lgMax:mt-4 px-12'>
          <div className='flex items-center w-full'>
            <ArrowBack route={`/profile/${user.data?._id}`} />
            <h1 className='text-center text-xl4 lgMax:text-xl2 font-semibold mx-auto'>
              EDITAR USUARIO
            </h1>
          </div>
          <form
            encType='multipart/form-data'
            onSubmit={handleSubmit}
            className='mt-20 lgMax:mt-10 flex flex-col'
          >
            <div className='flex justify-evenly lgMax:items-center lgMax:flex-col'>
              <div className='flex flex-col w-1/4 lgMax:w-full lgMax:max-w-[500px] gap-9 lgMax:mb-9 items-center'>
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
              <div className='flex flex-col w-1/4 lgMax:w-full lgMax:max-w-[500px] lgMax:mb-9 gap-9 items-center'>
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
              <div className='flex flex-col w-1/4 lgMax:w-full lgMax:max-w-[500px] lgMax:mb-9 items-center'>
                <div className='w-[90px] h-[90px] overflow-hidden rounded-full mb-[19px]'>
                  {pathImg ? <img src={pathImg} alt='image' /> : (
                    <Image src={profileIcon} alt='profile icon' className='w-full' />
                  )}
                </div>
                <div className='w-full mb-9'>
                  <Input
                    label='Subir foto de perfil'
                    name='profileImage'
                    type='file'
                    value={profileImage?.name}
                    onChange={e => handleFile(e)}
                  />
                </div>
                {loggedUser.data?.admin && (
                  <TagInputPatients
                    tagged={patients}
                    setTagged={setPatients}
                    user={user.data}
                  />
                )}
              </div>
            </div>
            <div className='flex justify-evenly lgMax:justify-between mt-10 lgMax:mt-5'>
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
            <h1>Perfil editado satisfactoriamente</h1>
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
