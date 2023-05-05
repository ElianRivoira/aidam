import { changePassword, sendToken } from '@/services/users';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Input from '@/components/form/Input';
import Modal from '@/components/Modal';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const tokenString = Array.isArray(token) ? token[0] : token;

  const [response, setResponse] = useState(false);
  const [message, setMessage] = useState<string>();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isEqual, setIsEqual] = useState(false);
  const [validate, setValidate] = useState(false);
  const [email, setEmail] = useState<string>();
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);

  useEffect(() => {
    if (tokenString) {
      sendToken(tokenString).then((res) => {
        setMessage(res.message);
        setResponse(res.status);
        setEmail(res.email);
      });
    }
  }, [token]);

  useEffect(() => {
    if (password && repeatPassword) {
      if (password === repeatPassword) setIsEqual(true);
      else setIsEqual(false);
    } else setValidate(false);
  }, [password, repeatPassword]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (password === repeatPassword && email) {
        await changePassword(email, password);
        setType(1);
        setOpen(true);
      } else {
        setErrors([
          {
            message:
              'Las contraseñas deben coincidir. Por favor revise los campos "contraseña" y "repetir contraseña"',
          },
        ]);
        setType(2);
        setOpen(true);
      }
    } catch (e: any) {
      setErrors(e.response.data.errors);
      setType(2);
      setOpen(true);
    }
  };

  if (!response) {
    return <div>{message}</div>;
  }

  return (
    <>
      <div className='h-screen flex justify-center items-center'>
        <div className='w-full shadow-xg rounded-3xl p-3.5 pb-5 mx-5 max-w-md flex flex-col items-center'>
          <p className='text-sm flex text-center'>
            Generá una nueva contraseña para:
          </p>
          <p className='mb-4 font-semibold'>{email}</p>
          <form
            className='w-full px-4 flex flex-col items-center'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col gap-1.5'>
              <Input
                name='password1'
                label='Nueva contraseña'
                type='password'
                onChange={(e: any) => setPassword(e.target.value)}
                value={password}
                isEqual={isEqual}
                validate={validate}
              />
              <Input
                name='password2'
                label='Repetir contraseña'
                type='password'
                onChange={(e: any) => {
                  setRepeatPassword(e.target.value);
                  if (!repeatPassword) setValidate(true);
                }}
                value={repeatPassword}
                isEqual={isEqual}
                validate={validate}
              />
            </div>
            <button
              type='submit'
              className='w-[165px] h-8 mt-6 rounded-md bg-aidam80 text-white font-normal text-sm hover:bg-aidam70 active:shadow-active'
            >
              Cambiar contraseña
            </button>
          </form>
        </div>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false)
            router.push("/login")
          }}
          type={type}
          errors={errors}
        >
          <h1>¡Su contraseña ha sido cambiada con éxito!</h1>
          <p className='text-sm font-normal mt-1'>
            Ya puede iniciar sesión en la aplicación
          </p>
        </Modal>
      </div>
    </>
  );
};

export default ResetPasswordPage;
