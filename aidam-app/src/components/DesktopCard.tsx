import Link from 'next/link';

interface DesktopCardProps {
  user?: User;
  patient?: Patient;
}

const DesktopCard: React.FC<DesktopCardProps> = ({ user, patient }) => {
  let lastConnectionString: string = '';
  if (user) {
    if (!user.lastLoginDate) {
      lastConnectionString = 'No se ha conectado aún';
    } else {
      lastConnectionString = new Date(user.lastLoginDate).toLocaleString();
    }
  }

  return (
    <>
      {user ? (
        <Link
          href={`/profile/${user._id}`}
          className='flex py-5 px-7 rounded-xl border border-[#F0F0F0] mb-4'
        >
          <div className='w-[20%]'>
            <div className='mb-4 text-sm text-[#505050]'>Nombre y Apellido</div>
            <div className='font-semibold'>
              {user.firstName + ' ' + user.lastName}
            </div>
          </div>
          <div className='w-[20%]'>
            <div className='mb-4 text-sm text-[#505050]'>Profesión</div>
            <div className='font-semibold'>{user.profession}</div>
          </div>
          <div className='w-[20%]'>
            <div className='mb-4 text-sm text-[#505050]'>Última conexión</div>
            <div className='font-semibold'>{lastConnectionString}</div>
          </div>
          <div className='w-[40%]'>
            <div className='mb-4 text-sm text-[#505050]'>Últimas Acciones</div>
            <div className='font-semibold'>
              {user.lastThreeTasks.length > 0 ? (
                user.lastThreeTasks.map((action, index) => (
                  <li key={index}>{action}</li>
                ))
              ) : (
                <p>Este usuario no ha realizado acciones</p>
              )}
            </div>
          </div>
        </Link>
      ) : patient ? (
        <Link
          href={`/patients/${patient._id}/profile`}
          className='flex py-5 px-7 rounded-xl border border-[#F0F0F0] mb-4'
        >
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-[#505050]'>Nombre y Apellido</div>
            <div className='font-semibold'>
              {patient.firstName + ' ' + patient.lastName}
            </div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-[#505050]'>DNI</div>
            <div className='font-semibold'>{patient.dni}</div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-[#505050]'>Obra Social</div>
            <div className='font-semibold'>
              {patient.socialwork.toUpperCase()}
            </div>
          </div>
          <div className='w-1/4'>
            <div className='mb-4 text-sm text-[#505050]'>N° de afiliado</div>
            <div className='font-semibold'>{patient.affiliateNumber}</div>
          </div>
        </Link>
      ) : null}
    </>
  );
};

export default DesktopCard;
